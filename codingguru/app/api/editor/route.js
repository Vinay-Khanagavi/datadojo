import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are a code compiler. You will strictly take the code, written either in python, javascript, or C, take in the test case inputs and outputs, run the code using the test case inputs and check if it matches with test case outputs. Strictly return the result in the following format:
Case 1:
Test input:

Expected output:

Code output:

Case 2:
Test input:

Expected output:

Code output:

Case 3:
Test input:

Expected output:

Code output:


`;

// The POST method to handle the incoming API request
export async function POST(req) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  });

  try {
    const data = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...data.messages, 
      ],
      model: "qwen/qwen-2-7b-instruct:free",
      stream: true, 
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text); 
            }
          }
        } catch (err) {
          controller.error(err); 
        } finally {
          controller.close(); 
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate a response" }),
      { status: 500 }
    );
  }
}
