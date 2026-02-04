# 💬 Feature 02: Core Chat

## Description
Interactive chat interface that allows users to converse with the Job Hunter AI agent. The agent can answer questions, provide advice, and use tools to perform specific actions.

---

## User Stories

### US-201: Basic Chat
**As a** user  
**I want to** send messages in a chat interface  
**So that** I can interact with the AI agent

**Acceptance Criteria:**
- [ ] Text input at the bottom
- [ ] User messages aligned to the right
- [ ] Agent messages aligned to the left
- [ ] Auto-scroll to new messages
- [ ] "Typing..." indicator while agent responds

### US-202: Streaming Responses
**As a** user  
**I want to** see agent responses appear word by word  
**So that** I get immediate feedback without waiting for the full response

**Acceptance Criteria:**
- [ ] Responses displayed in real-time (streaming)
- [ ] Text appears progressively
- [ ] No perceptible delay between chunks

### US-203: Conversation History
**As a** user  
**I want to** have the agent remember conversation context  
**So that** I can have a fluid interaction without repeating information

**Acceptance Criteria:**
- [ ] History maintained during session
- [ ] Agent references previous messages when relevant
- [ ] Context limit managed automatically

---

## Technical Specifications

### API Route
```
POST /api/chat
```

**Request Body:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}
```

**Response:** Text stream (SSE)

### AI Model
- **Primary model:** GPT-4o-mini (cost-effective)
- **Fallback/Upgrade:** GPT-4o (for complex reasoning)

### UI Components
- `ChatContainer` - Main container
- `MessageList` - Message list
- `MessageBubble` - Individual message bubble
- `ChatInput` - Input with send button

---

## Dependencies
- Vercel AI SDK (`ai` package)
- OpenAI provider (`@ai-sdk/openai`)
- shadcn/ui components (Button, Input, ScrollArea)

---

## Implementation Notes
- Use API Route (NOT Server Actions) per project rules
- Implement with `streamText` from Vercel AI SDK
- Consider rate limiting to protect API costs
