# AI Projects Tagging Guide

This document defines specialized tags for categorizing AI-related projects in the Best of JS catalog. These tags work in combination with the general `ai` tag and other existing tags to provide precise categorization.

## The Base `ai` Tag

**Description:** Projects with built-in AI/LLM integrations, capabilities, or features.

**When to Use:**
- Project ships with AI/LLM integrations out of the box
- Has native AI capabilities or built-in AI features
- Provides AI-specific APIs, SDKs, or tools

**When NOT to Use:**
- Generic infrastructure that CAN be used for AI but has no AI features (e.g., workflow engines, databases, web frameworks)
- Projects where AI is just a documented use case, not a built-in feature

**Examples:**
- ✅ **n8n**: Has native AI capabilities with built-in OpenAI, Anthropic nodes
- ✅ **Vercel AI SDK**: Ships with AI/LLM integrations
- ✅ **TensorFlow.js**: Provides ML model training and inference
- ❌ **Workflow DevKit**: Generic workflow orchestration (AI is just a use case)
- ❌ **Express.js**: Web framework (even though you can build AI apps with it)

**The Rule:** If it ships with AI integrations or features → `ai` tag. If it's generic infrastructure you can use for AI → no `ai` tag.

---

## Specialized AI Tags

These tags refine and categorize projects beyond the general `ai` tag:

### `ai-methodology`

**Description:** Frameworks, patterns, and systematic approaches for AI-assisted development workflows. These are meta-tools that guide *how* teams work with AI agents, rather than libraries to build AI features into applications.

**Key Characteristics:**
- Prescriptive frameworks for organizing AI-assisted development
- Focus on development practices and team coordination
- Provide templates, patterns, and processes to follow
- Success measured by adoption of practices, not just stars

**Examples:**
- **BMad-Method**: Breakthrough Method for Agile AI Driven Development
- **Task Master**: AI-powered task-management system for Cursor, Lovable, Windsurf

**Note:** This tag is excluded from rankings as methodologies have different success metrics than traditional libraries.

---

### `ai-agents`

**Description:** Frameworks for building autonomous agents with reasoning, tool use, and orchestration capabilities beyond simple LLM API calls.

**Key Characteristics:**
- Multi-step reasoning and planning
- Tool/function orchestration
- Memory and state management
- Workflow and chain composition
- Observability and tracing
- RAG (Retrieval Augmented Generation) support

**Examples:**
- **Mastra**: TypeScript AI agent framework with assistants, RAG, and observability
- **VoltAgent**: Open Source TypeScript AI Agent Framework with built-in LLM Observability
- **Vercel AI SDK**: AI Toolkit for TypeScript with agent orchestration, multi-step workflows, and tool integration
- **LangChain.js**: Building applications with LLMs through composability
- **LlamaIndexTS**: Data framework for LLM applications with server-side focus

**What is NOT `ai-agents`:**
- Pure API clients (e.g., OpenAI Node API, MCP-SDK)
- HuggingFace.js (API wrapper without orchestration)

---

### `ai-builder`

**Description:** Tools that generate complete, running applications from prompts or descriptions, handling the full development lifecycle including code generation, dependencies, runtime, and often deployment.

**Key Characteristics:**
- Generate full applications from natural language descriptions
- Handle dependencies and project setup automatically
- Provide runtime/preview environments
- Often include deployment capabilities
- Go beyond code snippets to complete, executable apps

**Examples:**
- **bolt.new**: Prompt, run, edit, and deploy full-stack web applications
- **Dyad**: Free, local, open-source AI app builder
- **Quests**: The open-source app builder
- **draw-a-ui**: Draw a mockup and generate HTML for it

**What is NOT `ai-builder`:**
- IDEs with AI assistance (e.g., Void - these help you write code, not generate complete apps)
- Code completion tools (these assist, not generate full apps)
- Agent frameworks (these orchestrate AI logic, not build apps)

---

## Understanding the `ml` (Machine Learning) Tag

The `ml` tag predates the LLM/AI boom and has a **specific, technical meaning** that distinguishes it from the general `ai` tag.

### When to Use `ml`:

The `ml` tag should be applied to projects that work directly with **machine learning models** at a fundamental level:

- **Training models** - Projects that help train ML models
- **Running model inference** - Libraries that execute models locally (browser or Node.js)
- **Model deployment** - Tools for deploying and serving models
- **Traditional ML/NLP** - Statistical algorithms and pre-LLM natural language processing
- **Computer vision** - Image recognition, face detection, OCR models

**Examples with `ml`:**
- **TensorFlow.js**: Training and deploying ML models in JavaScript
- **Transformers.js**: Running Hugging Face models in the browser
- **node-llama-cpp**: Running LLMs locally with llama.cpp bindings
- **natural**: Traditional statistical NLP algorithms
- **face-api.js**: Face detection and recognition models
- **Tesseract.js**: OCR model inference

### When NOT to Use `ml`:

Projects that **consume AI services via APIs** without touching models directly should use `ai` but NOT `ml`:

- API clients and SDKs (OpenAI Node API, Anthropic SDK)
- Agent frameworks that orchestrate API calls (Vercel AI SDK, Mastra, VoltAgent, LangChain.js)
- Chat interfaces that call LLM APIs
- Code generators that use AI services

**The Key Distinction:**
- `ml` = Works with **models themselves** (train, deploy, infer)
- `ai` (without `ml`) = Uses **AI services/APIs** without touching models

---

## Tagging Principles

### Avoid Redundancy
Don't create tags that can be expressed by combining existing tags:
- ✅ Use `ai` + `automation` instead of creating `ai-automation`
- ✅ Use `ai` + `component` instead of creating `ai-components`
- ✅ Use `ai` + `chat` instead of creating `ai-chat`
- ✅ Use `ai` + `sdk` for AI SDKs and API clients (e.g., OpenAI Node API, MCP-SDK, HuggingFace.js)

### When to Create New Tags
Only create new AI sub-tags when:
1. The concept cannot be expressed by combining existing tags
2. The distinction helps developers find what they need
3. Multiple projects share this specific characteristic

---

## Related Tags

These existing tags frequently combine with `ai`:
- `api-wrapper` (being renamed to `sdk`) - API clients and SDKs for AI services
- `auto` - Automation tools
- `bot` - Chatbots and conversational AI
- `chat` - Chat/conversational interfaces
- `component` - UI components
- `lowcode` - Visual workflow builders
- `ml` - Traditional machine learning/NLP (models, training, inference)
- `scraping` - Web scraping tools

---

*Last updated: December 2025*

