import fetch from 'node-fetch';
import fs from 'fs';

const apiKey = 'xai-fctJhg1WCRekF02bICdjTgmo8oe64Zs9upYAC6nbaC9zqQmt0J5U5B93kdCHpuq0pfC1ipQkjv85MZh6'; // <-- Replace with your real API key

const body = {
  model: 'grok-4',
  messages: [
    { role: 'user', content: 'Add the line "Hello from Grok!" to the end of hello.txt' }
  ],
  tools: [
    {
      type: 'function',
      function: {
        name: 'edit_file',
        description: 'Edit a file on disk',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Path to the file' },
            content: { type: 'string', description: 'New file content' }
          },
          required: ['path', 'content']
        }
      }
    }
  ],
  tool_choice: 'auto'
};

const response = await fetch('https://api.x.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});

const data = await response.json();
console.log('Grok API response:\n', JSON.stringify(data, null, 2));

// --- Extract and apply the file edit (optional) ---
if (
  data.choices &&
  data.choices[0]?.message?.tool_calls &&
  data.choices[0].message.tool_calls[0]?.function?.arguments
) {
  const args = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
  console.log('\nGrok wants to edit:', args.path);
  console.log('New file content:\n', args.content);

  // Uncomment to actually write the file:
  // fs.writeFileSync(args.path, args.content, 'utf8');
  // console.log(`File ${args.path} updated!`);
} else {
  console.log('\nNo tool call found in response.');
} 