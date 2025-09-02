// DeepSeek API 服务模块
// 提供与 DeepSeek API 的集成功能

// 从环境变量中获取API密钥
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

export interface DeepSeekConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface DeepSeekResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class DeepSeekApiService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(config?: DeepSeekConfig) {
    // 使用环境变量中的API密钥
    this.apiKey = DEEPSEEK_API_KEY;
    this.baseUrl = config?.baseUrl || import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
    this.model = config?.model || import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat';
  }

  /**
   * 更新配置（已废弃，API密钥已硬编码）
   */
  updateConfig(config?: DeepSeekConfig): void {
    // API密钥已硬编码，此方法保留仅为兼容性
    console.log('API密钥已硬编码，无需更新配置');
  }

  /**
   * 验证API密钥是否有效
   */
  async validateApiKey(): Promise<boolean> {
    try {
      if (!this.apiKey || this.apiKey.trim() === '' || this.apiKey === 'sk-your-deepseek-api-key-here') {
        console.error('请在环境变量中设置有效的DeepSeek API密钥');
        return false;
      }

      console.log('开始验证API密钥...');
      const response = await this.makeRequest('/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API验证响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => '无法读取错误信息');
        console.error('API验证失败详情:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        return false;
      }

      console.log('API密钥验证成功');
      return true;
    } catch (error) {
      console.error('API密钥验证异常:', error);
      return false;
    }
  }

  /**
   * 生成HTML内容
   */
  async generateHtml(text: string): Promise<DeepSeekResponse> {
    try {
      if (!this.apiKey || this.apiKey === 'sk-your-deepseek-api-key-here') {
        return {
          success: false,
          error: '请在环境变量中设置有效的DeepSeek API密钥'
        };
      }

      const messages: DeepSeekMessage[] = [
        {
          role: 'system',
          content: `你是一个专业的HTML生成助手。请将用户提供的文本转换为美观的HTML格式，要求：
1. 使用现代简约的设计风格
2. 采用橙色主色调（#f97316, #ea580c, #fb923c等）
3. 应用精美的阴影效果和渐变背景
4. 使用合理的排版和间距
5. 确保响应式设计
6. 只返回HTML内容，不要包含任何解释文字
7. 使用内联CSS样式，确保样式完整
8. 包含适当的标题、段落、列表等HTML元素
9. 添加现代化的视觉效果如圆角、阴影、渐变等`
        },
        {
          role: 'user',
          content: `请将以下文本转换为美观的HTML：\n\n${text}`
        }
      ];

      console.log('发送DeepSeek API请求...');
      const requestBody = {
        model: this.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000,
        stream: false
      };
      
      console.log('请求参数:', {
        url: `${this.baseUrl}/v1/chat/completions`,
        model: this.model,
        messagesCount: messages.length
      });

      const response = await this.makeRequest('/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('API响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '无法读取错误信息');
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        console.error('API请求失败详情:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        const errorMessage = errorData.error?.message || errorData.message || errorText || '未知错误';
        return {
          success: false,
          error: `API请求失败 (${response.status}): ${errorMessage}`
        };
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        const generatedContent = data.choices[0].message?.content || '';
        
        // 清理生成的内容，移除可能的markdown代码块标记
        const cleanedContent = generatedContent
          .replace(/```html\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();

        return {
          success: true,
          content: cleanedContent
        };
      } else {
        return {
          success: false,
          error: 'API返回数据格式异常'
        };
      }
    } catch (error) {
      console.error('DeepSeek API调用失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 发起API请求
   */
  private async makeRequest(endpoint: string, options: RequestInit): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'User-Agent': 'TextToHTML-App/1.0'
    };

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    return fetch(url, requestOptions);
  }
}

// 单例实例
let deepseekApiInstance: DeepSeekApiService | null = null;

/**
 * 获取DeepSeek API服务实例
 */
export function getDeepSeekApi(config?: DeepSeekConfig): DeepSeekApiService {
  if (!deepseekApiInstance) {
    deepseekApiInstance = new DeepSeekApiService(config);
  }
  
  return deepseekApiInstance;
}

/**
 * 重置API实例
 */
export function resetDeepSeekApi(): void {
  deepseekApiInstance = null;
}

// 导出服务类
export { DeepSeekApiService };

// 默认导出
export default {
  getDeepSeekApi,
  resetDeepSeekApi,
  DeepSeekApiService
};