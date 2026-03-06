import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { SYSTEM_PROMPT } from './prompt.js'
import { getMockData } from './services/mock-data-service.js'
import type { DataQueryRequest } from './types/data.js'

dotenv.config()

const glm = createOpenAI({
    baseURL: process.env.AI_BASE_URL,
    apiKey: process.env.AI_API_KEY,
})

const app = express()
app.use(cors())
app.use(express.json())

// 思考步骤类型
type ThinkingStepType = 'intent_analysis' | 'entity_extraction' | 'layout_planning' | 'component_creation' | 'complete'

// 输出思考步骤的辅助函数
function writeThinkingStep(
    res: express.Response,
    type: ThinkingStepType,
    status: 'active' | 'completed',
    detail?: string
) {
    const step = JSON.stringify({ type, status, detail })
    res.write(`THINKING:${step}\n`)
}

// 从 prompt 中提取关键信息的简单实现
function extractEntities(prompt: string): { cluster?: string; resources: string[] } {
    const clusterMatch = prompt.match(/集群\s*[：:]?\s*([a-zA-Z0-9_-]+)/i)
    const cluster = clusterMatch ? clusterMatch[1] : undefined

    const resources: string[] = []
    if (/VIP/i.test(prompt)) resources.push('VIP')
    if (/\bVS\b/i.test(prompt)) resources.push('VS')
    if (/Server/i.test(prompt)) resources.push('Server')
    if (/Connection/i.test(prompt)) resources.push('Connection')

    return { cluster, resources }
}

// 组件类型映射
const COMPONENT_NAMES: Record<string, string> = {
    'LineChart': '折线图',
    'BarChart': '柱状图',
    'PieChart': '饼图',
    'RadarChart': '雷达图',
    'GaugeChart': '仪表盘',
    'MetricCard': '指标卡片',
    'SectionTitle': '标题',
    'Grid': '网格布局',
    'Flex': '弹性布局',
    'Card': '卡片容器',
    'StatusDot': '状态指示',
    'ChartPlaceholder': '图表占位'
}

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt required' })
        }

        const model = process.env.AI_MODEL || 'glm-5'

        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        // 提取关键信息
        const entities = extractEntities(prompt)

        // Step 1: 意图分析
        writeThinkingStep(res, 'intent_analysis', 'active', '正在分析用户请求...')
        await new Promise(r => setTimeout(r, 300))
        writeThinkingStep(res, 'intent_analysis', 'completed', '识别为仪表盘生成请求')

        // Step 2: 实体提取
        writeThinkingStep(res, 'entity_extraction', 'active', '正在提取关键信息...')
        await new Promise(r => setTimeout(r, 250))
        const entityDetails: string[] = []
        if (entities.cluster) entityDetails.push(`集群: ${entities.cluster}`)
        if (entities.resources.length > 0) entityDetails.push(`资源: ${entities.resources.join(', ')}`)
        writeThinkingStep(res, 'entity_extraction', 'completed', entityDetails.join('\n') || '未检测到特定实体，将生成通用仪表盘')

        // Step 3: 布局规划
        writeThinkingStep(res, 'layout_planning', 'active', '正在规划仪表盘布局...')
        await new Promise(r => setTimeout(r, 400))
        writeThinkingStep(res, 'layout_planning', 'completed', '布局规划完成')

        // Step 4: 组件创建 - active状态
        writeThinkingStep(res, 'component_creation', 'active', '准备创建组件...')

        const result = streamText({
            model: glm.chat(model),
            system: SYSTEM_PROMPT,
            prompt,
            temperature: 0.6,
        })

        // 收集组件信息
        const createdComponents: string[] = []
        let buffer = ''

        for await (const chunk of result.textStream) {
            // 将chunk添加到buffer
            buffer += chunk

            // 尝试解析完整的JSONL行
            const lines = buffer.split('\n')
            buffer = lines.pop() || '' // 保留最后一个不完整的行

            for (const line of lines) {
                if (!line.trim()) continue

                // 检查是否是THINKING行（不应该发生，但做防御性处理）
                if (line.startsWith('THINKING:')) {
                    // 直接转发THINKING消息
                    res.write(line + '\n')
                    continue
                }

                try {
                    const parsed = JSON.parse(line)
                    if (parsed.op === 'add' && parsed.path.startsWith('/elements/') && parsed.value?.type) {
                        const componentType = parsed.value.type
                        const componentName = COMPONENT_NAMES[componentType] || componentType
                        const title = parsed.value.props?.title || ''
                        const componentInfo = title ? `${componentName}: ${title}` : componentName
                        createdComponents.push(componentInfo)

                        // 实时输出组件创建进度（单独一行THINKING消息）
                        const detail = `已创建 ${createdComponents.length} 个组件\n${createdComponents.join('\n')}`
                        writeThinkingStep(res, 'component_creation', 'active', detail)
                    }
                } catch {
                    // 忽略解析错误
                }

                // 输出原始JSONL
                res.write(line + '\n')
            }
        }

        // 处理buffer中剩余的内容
        if (buffer.trim()) {
            // 检查是否是THINKING行
            if (!buffer.startsWith('THINKING:')) {
                try {
                    const parsed = JSON.parse(buffer)
                    if (parsed.op === 'add' && parsed.path.startsWith('/elements/') && parsed.value?.type) {
                        const componentType = parsed.value.type
                        const componentName = COMPONENT_NAMES[componentType] || componentType
                        const title = parsed.value.props?.title || ''
                        const componentInfo = title ? `${componentName}: ${title}` : componentName
                        createdComponents.push(componentInfo)
                    }
                } catch {
                    // 忽略解析错误
                }
                res.write(buffer + '\n')
            }
        }

        // Step 4: 组件创建 - completed状态
        const finalDetail = createdComponents.length > 0
            ? `已创建 ${createdComponents.length} 个组件\n${createdComponents.join('\n')}`
            : '未创建任何组件'
        writeThinkingStep(res, 'component_creation', 'completed', finalDetail)

        // Step 5: 完成
        writeThinkingStep(res, 'complete', 'completed', '仪表盘生成完成')

        res.end()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

// 数据查询 API
app.post('/api/data/query', async (req, res) => {
    try {
        const params = req.body as DataQueryRequest

        if (!params.resourceType) {
            return res.status(400).json({ error: 'resourceType is required' })
        }

        const data = await getMockData(params)
        res.json(data)
    } catch (error) {
        console.error('Data query error:', error)
        res.status(500).json({ error: 'Failed to fetch data' })
    }
})

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`[backend] Server running at http://localhost:${port}`)
})
