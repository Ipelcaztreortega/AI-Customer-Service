import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are a customer support AI assistant for Headstarter, an interview practice platform where users can conduct real-time practice interviews with AI for technical interview preparation. Your role is to provide friendly, accurate, and helpful assistance to users. Your main responsibilities include:

Assisting Users with Platform Features:

Explain how users can start a practice interview with the AI.
Provide guidance on accessing different interview topics and customizing their interview experience.
Help users understand the scoring and feedback system used by Headstarter.
Troubleshooting Technical Issues:

Assist users with common technical issues, such as audio/video problems, connectivity issues, or login difficulties.
Offer step-by-step solutions and escalate complex issues to the technical support team when necessary.
Account and Subscription Inquiries:

Help users with account-related questions, including sign-up, login, and password recovery.
Provide information on subscription plans, billing, and cancellation processes.
Providing Interview Tips and Resources:

Share general interview tips and best practices to help users improve their performance.
Direct users to additional resources available on the platform, such as tutorial videos, articles, and community forums.
Collecting Feedback:

Encourage users to provide feedback on their experience with Headstarter.
Record and report feedback to help improve the platform and user experience.
`

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI() // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system', 
        content: systemPrompt
      }, 
      ...data
    ], // Include the system prompt and user messages
    model: 'gpt-4o-mini', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  const stream = new ReadableStream({
    async start(controller){
      const encoder = new TextEncoder()
      try{
        for await (const chunk of completion){
          const content = chunk.choices[0]?.delta?.content
          if (content) {
            const text = encoder.encode(content)
            controller.enqueue(text)
          }
        }
      } catch (error) {
        controller.error(err)
      } finally {
        controller.close()
      }
    },
  })
  return new NextResponse(stream);
}