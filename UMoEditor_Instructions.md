# Umo Editor: A Comprehensive Guide for Python Developers

Welcome to Umo Editor! This document is designed to provide you, an experienced Python developer, with a comprehensive understanding of Umo Editor. While you're proficient in Python, this guide will bridge the gap to technologies used in Umo Editor, namely TypeScript, Vue.js, and Tiptap, and explain how to integrate it into your Svelte SaaS platform.

## 1. Introduction to Umo Editor

Umo Editor is a powerful, open-source rich-text document editor built using Vue.js 3 and Tiptap 2. It's designed to be user-friendly and feature-rich, offering capabilities similar to desktop word processors directly in the browser. Key features include:

*   **Rich Text Editing**: Comprehensive formatting options, support for various text styles, lists, tables, images, and more.
*   **Pagination**:  Word-processor-like pagination for better document layout and printing.
*   **Markdown Support**: Seamlessly switch between rich text and Markdown editing.
*   **AI Assistant**: Integrated AI features to enhance writing and editing workflows.
*   **Extensibility**:  Customizable and extensible through plugins and configuration options.
*   **Frontend Focus**: Umo Editor is primarily a frontend component. It handles document editing and display within the user's browser.

**Technologies Used:**

*   **Vue.js (>=v3.x)**: A progressive JavaScript framework for building user interfaces. Umo Editor is built as a Vue.js component.
*   **Tiptap (>=v2.6)**: A headless rich-text editor framework for Vue.js. Tiptap provides the core editing engine for Umo Editor.
*   **TypeScript (>=v5.5)**: A statically typed superset of JavaScript that enhances code maintainability and readability. Umo Editor is written in TypeScript.
*   **Vite (>=v4.x)**: A fast build tool and development server for modern web projects. Vite is used for development and building Umo Editor.

**Backend and Frontend Relationship:**

It's essential to understand that Umo Editor is primarily a **frontend** component. It runs entirely in the user's browser and does not inherently require a dedicated backend server to function as a basic editor.

However, for a SaaS platform, you will likely need a backend to handle:

*   **Saving and Loading Documents**: Umo Editor provides callbacks (`onSave`, `onFileUpload`) that you need to implement to interact with your backend for persistent storage.
*   **AI Functionality Integration**: The AI assistant in Umo Editor is a frontend feature that needs to be connected to an actual AI service on your backend (or a third-party AI service) to perform tasks like text generation, rewriting, etc.
*   **User Authentication and Authorization**: Your SaaS platform's backend will manage user sessions and permissions for accessing and modifying documents created with Umo Editor.

In essence, Umo Editor provides the rich-text editing interface, and your SaaS backend provides the data persistence, AI processing, and user management layers around it.

---

## 2. Core Concepts for Python Developers: TypeScript, Vue.js, and Tiptap

Let's bridge your Python expertise to the frontend technologies used in Umo Editor.

### 2.1 TypeScript: Python with Types

Think of TypeScript as JavaScript with static typing, similar to how Python can be type-hinted. If you're familiar with Python's type hints, you'll grasp TypeScript quickly.

*   **Static Typing**: TypeScript enforces type checking at compile time, catching errors before runtime, much like static analysis tools for Python (e.g., MyPy). This leads to more robust and maintainable code.
*   **Interfaces and Classes**: TypeScript supports interfaces and classes, similar to Python's object-oriented programming features.
*   **Compilation**: TypeScript code is compiled into standard JavaScript that browsers can understand.  This compilation step is where type checking happens.
*   **Benefits for Python Dev**: Your experience with Python's type hints will make learning TypeScript easier. You'll appreciate the improved code organization and error detection.

**Example (Conceptual Python vs. TypeScript):**

**Python (Type Hinted):**

```python
def greet(name: str) -> str:
    return f"Hello, {name}"
```

**TypeScript:**

```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

### 2.2 Vue.js 3: Reactive Frontend Framework

Vue.js is a progressive JavaScript framework for building user interfaces. Key concepts for you to understand:

*   **Components**: Vue.js applications are built using components – reusable, self-contained blocks of code that encapsulate HTML, CSS, and JavaScript (or TypeScript). Think of them as similar to React components or even custom elements in web development.  In Umo Editor, everything from the toolbar to the editor itself is built as Vue components.
*   **Reactivity**: Vue.js uses a reactivity system. When data changes, the UI automatically updates to reflect those changes. This is a core concept and simplifies UI development significantly. You define data, and Vue.js takes care of updating the DOM when the data changes.
*   **Templates**: Vue components use HTML-based templates to define the structure of the UI. These templates can include JavaScript expressions and directives for dynamic rendering.
*   **Composition API**: Vue 3 introduces the Composition API, a set of APIs that allow you to organize component logic in a more flexible and reusable way, often using functions and hooks.  Umo Editor heavily utilizes the Composition API.
*   **`<script setup>`**:  A Vue 3 feature that simplifies the Composition API usage within components, making the syntax cleaner and more concise (as seen in `src/app.vue`).

**Analogy to Python Web Frameworks (like Flask/Django):**

If you're familiar with Python web frameworks, think of Vue.js components as similar to templates and views in those frameworks, but entirely on the frontend. Vue.js handles the dynamic rendering and user interactions in the browser, reducing the need for manual DOM manipulation.

### 2.3 Tiptap 2: Headless Rich-Text Editor

Tiptap is a headless rich-text editor framework for Vue.js (and React, but Umo Editor uses the Vue.js version).

*   **Headless**:  "Headless" means Tiptap provides the core editing logic and data model but doesn't come with a pre-built UI. This gives developers full control over the editor's appearance and behavior. Umo Editor builds its UI on top of Tiptap.
*   **ProseMirror**: Tiptap is based on ProseMirror, a powerful toolkit for building rich-text editors. ProseMirror handles the complex aspects of content editing, like collaborative editing, undo/redo, and data serialization.
*   **Extensions**: Tiptap is highly extensible. Features like bold text, headings, lists, etc., are implemented as "extensions". Umo Editor leverages Tiptap's extension system to provide its rich feature set and also allows for custom extensions.
*   **Vue.js Integration**: Tiptap is designed to work seamlessly with Vue.js, making it easy to build rich-text editors within Vue.js applications.

**Key Takeaway**: Tiptap is the engine under the hood of Umo Editor, providing the robust rich-text editing capabilities. Umo Editor then adds a user-friendly Vue.js-based UI on top of Tiptap, along with features like pagination and AI assistance.

---

## 3. Integrating Umo Editor into Your Svelte SaaS Platform

There are a couple of primary ways to integrate Umo Editor into your Svelte SaaS platform.

### 3.1 Integration Strategies

1.  **Direct Component Integration (More Complex)**:
    *   **Concept**:  Treat Umo Editor as a Vue.js component and integrate it directly into your Svelte application. This involves making your Svelte application compatible with Vue.js components.
    *   **Complexity**: This is more complex because Svelte and Vue.js are different frameworks. You'll need to handle interoperability, likely using tools or techniques to allow Vue components to run within a Svelte environment. This might involve setting up a Vue.js runtime within your Svelte app or using component wrappers.
    *   **Pros**:  Potentially more seamless integration, better performance if done correctly, and more control over component interaction.
    *   **Cons**:  Significant setup and configuration overhead, steeper learning curve, potential compatibility issues between Vue and Svelte ecosystems.

2.  **Iframe Embedding (Simpler, Recommended for Starting)**:
    *   **Concept**:  Embed Umo Editor into your Svelte application using an `<iframe>`.  You would essentially host Umo Editor as a separate application (or a bundle of static files) and load it within your Svelte page via an iframe.
    *   **Complexity**:  Much simpler to set up. You treat Umo Editor as a self-contained unit. Communication between the Svelte app and the Umo Editor in the iframe would happen through standard iframe communication methods (e.g., `postMessage`).
    *   **Pros**:  Easiest and quickest way to integrate, minimal impact on your existing Svelte codebase, clear separation of concerns.
    *   **Cons**:  Slightly less seamless user experience compared to direct component integration, potential challenges in deep integration and complex communication between Svelte app and iframe content, possible performance overhead of running a separate application within an iframe.

**Recommendation**: For a first integration, especially given your focus on quickly adding rich-text editing, **iframe embedding is highly recommended**. It's significantly less complex and will allow you to get Umo Editor working in your SaaS platform much faster.  You can always explore direct component integration later if needed.

---

### 3.2 Iframe Integration Steps

Here’s how to integrate Umo Editor into your Svelte SaaS platform using an iframe:

**Step 1: Build Umo Editor as a Standalone Application**

You'll need to build Umo Editor into a set of static files that can be hosted independently.  Assuming you have the Umo Editor codebase (from the files you provided), you would typically run build commands in its directory.  Based on the `package.json` and `vite.config.ts` in the Umo Editor project, the build process is likely as follows:

1.  **Navigate to the Umo Editor directory** in your terminal.
2.  **Install dependencies**: `npm install` or `yarn install`
3.  **Build the application**: `npm run build` or `yarn build`

This process will generate a `dist` folder (or similar, depending on Vite configuration) containing the compiled static files (HTML, CSS, JavaScript, assets) for Umo Editor.

**Step 2: Host the Built Umo Editor Files**

You need to make these built files accessible to your Svelte application. You have a few options:

1.  **Public Hosting**:  Upload the contents of the `dist` folder to a public hosting service like Netlify, Vercel, or AWS S3. This will give you a URL where Umo Editor is hosted (e.g., `https://umo-editor-instance.example.com`).
2.  **Serve from Your SaaS Backend**: You can configure your SaaS backend (likely written in Python) to serve the static files from the `dist` folder.  For example, if you use Flask, you can configure a static route to serve files from the `dist` directory.  Then Umo Editor would be accessible at a URL on your domain (e.g., `https://your-saas-platform.com/umo-editor`).
3.  **Local Serving (for development)**: For development, you can simply serve the `dist` folder locally using a simple HTTP server (e.g., `npx serve dist` or `python -m http.server` in the `dist` directory).

**Step 3: Embed the Iframe in Your Svelte Component**

In your Svelte application, in the Svelte component where you want to include the editor, use the `<iframe>` tag:

```svelte
<script>
  import { onMount } from 'svelte';

  let iframeURL = 'https://umo-editor-instance.example.com'; // Replace with your hosted Umo Editor URL

  onMount(() => {
    // Optional: Handle iframe communication here if needed using postMessage
  });
</script>

<div class="editor-container">
  <iframe src={iframeURL} title="Umo Editor" frameborder="0" />
</div>

<style>
  .editor-container {
    width: 100%;
    height: 800px; /* Adjust as needed */
  }

  iframe {
    width: 100%;
    height: 100%;
  }
</style>
```

**Important Considerations for Iframe Integration:**

*   **URL**:  Replace `'https://umo-editor-instance.example.com'` with the actual URL where you are hosting your built Umo Editor files.
*   **Styling**: Adjust the CSS (`.editor-container` and `iframe` styles) to fit Umo Editor nicely within your Svelte layout.
*   **Communication (Optional)**: For basic embedding, you might not need immediate communication. However, if you need to send data to or receive data from Umo Editor running in the iframe (e.g., to trigger save, load document, get content), you'll need to implement `postMessage` based communication between your Svelte app and the iframe.  We'll discuss this in more detail later if needed.

**Step 4: Test and Adjust**

1.  Run your Svelte application.
2.  You should now see Umo Editor embedded in your Svelte page within the iframe.
3.  Test basic editing functionalities.
4.  Adjust styling and iframe settings as needed.

---

**Next Steps**: We'll now explore the default and non-default functionalities of Umo Editor and how they interact.

## 4. Default vs. Non-Default Functionalities and AI Interaction

Umo Editor is highly configurable. Let's explore the default functionalities and how you can customize them.  We'll refer to the `src/options.ts` file, which defines the `defaultOptions` and the schema for customization.

**4.1 Categories of Functionalities and Customization**

Umo Editor's functionalities are broadly categorized and configurable through the `options` prop. Here's a breakdown of key categories:

*   **Editor Core (`editorKey`, `locale`, `theme`, `height`)**:
    *   **Default**: Basic editor setup with default locale (`zh-CN`), light theme, and 100% height.
    *   **Customization**:
        *   `editorKey`:  Useful if you have multiple editor instances on the same page, to uniquely identify them.
        *   `locale`: Change the editor's language (`en-US`, `zh-CN`, `ru-RU`).
        *   `theme`: Switch between `light`, `dark`, or `auto` (system theme).
        *   `height`:  Set a fixed height (e.g., `'600px'`) or use percentages.

*   **Dictionaries (`dicts`)**:
    *   **Default**: Provides default fonts, colors, line heights, symbols, emojis, and page sizes.
    *   **Customization**:  You can fully customize or extend these dictionaries. For example:
        *   `fonts`: Add or remove fonts from the font selection dropdown.
        *   `colors`:  Modify the color palette.
        *   `lineHeights`, `symbols`, `emojis`, `pageSizes`:  Customize these lists as needed for your application.

*   **Toolbar (`toolbar`)**:
    *   **Default**: Ribbon-style toolbar (`defaultMode: 'ribbon'`) with 'base', 'insert', 'table', 'tools', 'page', and 'export' menus enabled. Source code editor is disabled by default (`enableSourceEditor: false`).
    *   **Customization**:
        *   `defaultMode`: Switch to `'classic'` toolbar.
        *   `enableSourceEditor`: Enable source code editing.
        *   `menus`:  Control which menus are visible in the toolbar. You can choose from `['base', 'insert', 'table', 'tools', 'page', 'export']` or create a custom menu.
        *   `disableMenuItems`:  Fine-grained control to disable specific items within the menus.
        *   `importWord`: Configure Word document import functionality.

*   **Page Settings (`page`)**:
    *   **Default**:  A4 page size, portrait orientation, default margins, white background, break marks shown, and a compact watermark (but with empty text by default).
    *   **Customization**:
        *   `defaultMargin`, `defaultOrientation`, `defaultBackground`:  Set initial page properties.
        *   `showBreakMarks`: Toggle page break markers.
        *   `watermark`:  Fully customize watermark type, text, styling, etc.
        *   `size`:  Set a default page size from the `pageSizes` dictionary or define a custom size.

*   **Document (`document`)**:
    *   **Default**:  Empty document (`content: ''`), with placeholder text in Chinese, spellcheck and Markdown enabled, bubble and block menus enabled, auto-save enabled (every 5 minutes), and focus on editor on load.
    *   **Customization**:
        *   `title`, `content`, `placeholder`: Set initial document content and placeholder text (you should localize the placeholder for your users).
        *   `enableSpellcheck`, `enableMarkdown`, `enableBubbleMenu`, `enableBlockMenu`: Toggle these features.
        *   `readOnly`:  Make the editor read-only.
        *   `autofocus`: Control editor focus behavior on load.
        *   `autoSave`: Configure auto-save interval or disable it.

*   **AI Assistant (`assistant`)**:
    *   **Default**: AI Assistant is disabled by default (`enabled: false`).  When enabled, it has a default `maxlength` of 100 characters for AI responses and provides a set of default commands: 'Continuation', 'Rewrite', 'Abbreviation', 'Expansion', 'Polish', 'Proofread', and 'Translate'.
    *   **Customization**:
        *   `enabled`:  Enable or disable the AI assistant.
        *   `maxlength`: Adjust the maximum length of AI-generated text.
        *   `commands`:  **Crucially, you can customize the AI commands.** You can modify the default commands, remove them, or add your own custom commands.  This is key for implementing your desired AI functionality.

*   **Templates (`templates`)**:
    *   **Default**: No templates are provided by default (`templates: []`).
    *   **Customization**: You can define an array of templates, each with a `title`, `description`, and `content`. These templates will be available to users for quickly starting documents.  The `app.vue` file in the provided code shows example templates.

*   **File Handling (`file`)**:
    *   **Default**:  No restrictions on file types (`allowedMimeTypes: []`), max file size 100MB, and previews configured for PDF and Office documents.
    *   **Customization**:
        *   `allowedMimeTypes`: Restrict allowed file types for uploads.
        *   `maxSize`: Change the maximum upload file size.
        *   `preview`: Customize how different file types are previewed in the editor.

*   **User (`user`)**:
    *   **Default**:  Basic user info (`userId: 'umoeditor'`, `nickName: 'Umo Editor'`, `avatarUrl: 'https://tdesign.gtimg.com/site/avatar.jpg'`).
    *   **Customization**:  Provide user information relevant to your application. This might be used for features like comments or collaboration (though comment functionality seems to be commented out in the default options).

*   **Extensions (`extensions`)**:
    *   **Default**:  Uses a default set of extensions to provide core rich-text editing features.
    *   **Customization**:  You can add custom Tiptap extensions to extend the editor's functionality. This is an advanced feature for when you need to add very specific or unique editing capabilities.

*   **Translations (`translations`)**:
    *   **Default**:  Default translations are provided for English, Chinese, and Russian.
    *   **Customization**:  You can override or extend the translations to customize the editor's UI text or add support for more languages.

*   **Callbacks (`onSave`, `onFileUpload`, `onFileDelete`, `onAssistant`, `onCustomImportWordMethod`)**:
    *   **Default**: Default callbacks are provided that either log errors to the console or reject promises, indicating that you **must** implement these.
    *   **Customization**:  **You MUST implement these callbacks to integrate Umo Editor with your backend.**
        *   `onSave`:  Handles saving document content to your backend.
        *   `onFileUpload`: Handles uploading files (images, documents, etc.) to your backend storage.
        *   `onFileDelete`: Handles deleting files from your backend storage.
        *   `onAssistant`:  **This is where you integrate your AI service.**  You need to implement this callback to send user prompts to your AI backend and receive responses to display in the editor.
        *   `onCustomImportWordMethod`:  If you need custom Word import logic, implement this.

**4.2 Interaction of Functionalities**

These functionalities interact to create the overall editor experience:

*   **Toolbar & Document**: Toolbar menus and items control the formatting and structure of the document content within the editor.
*   **Page Settings & Export/Print**: Page settings (size, margins, orientation) directly affect how the document is laid out for pagination, export (to PDF, etc.), and printing.
*   **AI Assistant & Document**: The AI assistant operates on the document content, allowing users to generate, rewrite, and enhance text directly within the editor.
*   **File Handling & Document**: File handling settings control how users can insert and manage files (images, etc.) within the document.
*   **Callbacks & Backend**: The callback functions are the crucial bridge between the frontend editor and your backend services for data persistence, AI, and file storage.

**4.3 Customizing Options**

You customize Umo Editor by passing an `options` object to the `<umo-editor>` component (if using direct component integration) or when initializing the `useUmoEditor` plugin (as seen in `main.ts`).  You can override any of the default options.

**Example (from `main.ts` and `app.vue`):**

In `main.ts`:

```typescript
import { useUmoEditor } from './components'
const app = createApp(App)

const options = {} // Default options, can be extended or overridden here

app.use(useUmoEditor, options as unknown as UmoEditorOptions)
```

In `app.vue`:

```vue
<template>
  <div class="box">
    <umo-editor ref="editorRef" v-bind="options" />
  </div>
</template>

<script setup lang="ts">
  // ...
  const options = $ref({ // Options defined in app.vue, overriding defaults
    toolbar: {
      enableSourceEditor: true, // Override default to enable source editor
    },
    assistant: {
      enabled: true,      // Enable AI assistant
    },
    // ... other options ...
  });
</script>
```

You can merge or replace options as needed.  Refer to `src/options.ts` and the `ojbectSchema` for detailed validation rules and merging strategies for each option.

---

## 5. Customizing AI Functionality for your SaaS Platform

Let's tailor the AI assistant to your SaaS platform's needs, focusing on user-selected text and task-specific prompts.

**5.1 Enabling and Basic Configuration**

First, ensure the AI assistant is enabled in your `options`:

```typescript
assistant: {
  enabled: true,
}
```

**5.2 User Text Selection and AI Trigger**

Umo Editor's AI assistant is designed to work with user-selected text. The typical workflow is:

1.  **User Selects Text**: The user selects a portion of text within the editor.
2.  **Trigger AI Action**: The user triggers an AI action. This is usually done via:
    *   **Context Menu**: Right-clicking on the selected text often brings up a context menu with AI options.
    *   **Toolbar Button**:  A dedicated "AI Assistant" button in the toolbar might also be used.
3.  **AI Command Execution**:  Umo Editor identifies the selected text and the chosen AI command and prepares to send a request to your backend via the `onAssistant` callback.

**5.3 Customizing AI Commands and Prompts**

The key to task-specific prompts is customizing the `commands` array within the `assistant` options.  Let's say you want to offer two AI actions in your SaaS platform: "Summarize" and "Improve Writing".

You would modify the `commands` option like this:

```typescript
assistant: {
  enabled: true,
  maxlength: 200, // Adjust as needed
  commands: [
    {
      label: { en_US: 'Summarize', zh_CN: '摘要', ru_RU: 'Краткое содержание' },
      value: {
        en_US: 'Summarize the selected text concisely.',
        zh_CN: '请简洁地总结所选文本。',
        ru_RU: 'Кратко изложите выделенный текст.'
      },
    },
    {
      label: { en_US: 'Improve Writing', zh_CN: '优化写作', ru_RU: 'Улучшить письмо' },
      value: {
        en_US: 'Improve the writing quality of the selected text, making it more clear and engaging.',
        zh_CN: '优化所选文本的写作质量，使其更清晰和引人入胜。',
        ru_RU: 'Улучшите качество письма выделенного текста, сделав его более ясным и привлекательным.'
      },
    },
    // Add more commands as needed (e.g., Translate, Expand, etc.)
  ],
},
```

**Explanation:**

*   **`commands` Array**:  This array defines the AI actions available to the user. Each object in the array represents a command.
*   **`label`**:  This is what the user sees in the AI command menu (context menu or toolbar dropdown).  Provide localized labels for different languages.
*   **`value`**:  This is the **prompt** that will be sent to your AI backend.  **Crucially, this is where you define task-specific prompts.**
    *   **Static Prompts**: In this example, we've used static prompts like "Summarize the selected text concisely." and "Improve the writing quality...".  These prompts are sent directly to your AI backend.
    *   **Dynamic Prompts (Advanced)**: For more advanced scenarios, you might need to create prompts dynamically based on the selected text or context.  You would handle this logic within your `onAssistant` callback (explained below).  For simpler cases, static prompts within the `value` are sufficient.

**5.4 Implementing the `onAssistant` Callback**

The `onAssistant` callback is the bridge to your AI backend.  You **must** implement this callback in your `options` to handle AI requests.

```typescript
async onAssistant(commandValue: LocaleLabel, selectedText: string) {
  // commandValue: The 'value' of the chosen AI command (e.g., { en_US: 'Summarize the selected text concisely.', ... })
  // selectedText: The text selected by the user

  const prompt = commandValue.en_US; // Or use locale based on user's language setting
  const fullPrompt = `${prompt}\n\nSelected Text:\n${selectedText}`; // Construct full prompt

  try {
    const aiResponse = await callYourBackendAIService(fullPrompt); // Replace with your actual AI backend call

    return aiResponse; // Return the AI-generated text to Umo Editor
  } catch (error) {
    console.error('AI Assistant Error:', error);
    throw new Error('AI processing failed.'); // Handle errors appropriately
  }
},
```

**Inside `onAssistant`:**

1.  **`commandValue`**:  This argument contains the `value` of the AI command that the user selected (from your `commands` array).  You can use this to determine which AI task to perform and to access the task-specific prompt you defined.
2.  **`selectedText`**: This is the text that the user selected in the editor.
3.  **Construct Full Prompt**: Create the complete prompt to send to your AI service. You can combine the task-specific prompt from `commandValue` with the `selectedText`.
4.  **`callYourBackendAIService(fullPrompt)`**:  **Replace this placeholder with the actual code to call your AI service.** This is where you would:
    *   Make an API request to your Python backend (or a third-party AI API like OpenAI, etc.).
    *   Send the `fullPrompt` to your AI service.
    *   Handle authentication and API keys for your AI service.
    *   Process the response from your AI service.
5.  **Return `aiResponse`**:  Return the AI-generated text from your backend. Umo Editor will then insert this text back into the editor, replacing the selected text or inserting it as new content, depending on how you want to handle it.
6.  **Error Handling**: Implement proper error handling in case the AI service call fails.

**5.5 Backend AI Service (Conceptual Python)**

Your `callYourBackendAIService` function in the frontend would correspond to a route in your Python backend (e.g., using Flask or FastAPI).  A simplified Python backend example:

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/ai-process', methods=['POST'])
def ai_process():
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({"error": "Prompt is missing"}), 400

    try:
        ai_response = call_ai_model(prompt) # Replace with your actual AI model call
        return jsonify({"result": ai_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def call_ai_model(prompt):
    # Replace this with your actual AI model integration (e.g., OpenAI API, Hugging Face)
    # Example using a placeholder AI model:
    if "summarize" in prompt.lower():
        return "This is a summarized version of the text."
    elif "improve writing" in prompt.lower():
        return "This text has been improved for clarity and engagement."
    else:
        return "AI processed text based on your prompt."

if __name__ == '__main__':
    app.run(debug=True)
```

**Important**:  This Python backend code is a **very basic example**.  In a real SaaS platform, you would need to:

*   Integrate with a real AI model or service (like OpenAI, Cohere, Hugging Face, your own trained models, etc.).
*   Implement proper authentication and authorization for your AI API endpoint.
*   Handle API keys and rate limiting for AI services.
*   Implement more robust error handling and logging.
*   Potentially optimize AI model calls for latency and cost.

---

## 6. Implementing a Chat-Based AI Assistant

For conversational interfaces, you'll need to:

1. **Create Chat UI Components**
```tsx
// ChatComponent.tsx
interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
}

export const ChatComponent = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    try {
      const response = await axios.post('/api/chat', {
        messages: [...messages, {content: input, role: 'user'}]
      }, {
        headers: {Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`}
      });

      setMessages(prev => [...prev, 
        {content: input, role: 'user'},
        {content: response.data.reply, role: 'assistant'}
      ]);
    } catch (error) {
      // Handle errors
    }
  };

  return (
    <div className="chat-container">
      <MessageThread messages={messages} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
};
```

2. **Backend Implementation (Python Example)**
```python
# FastAPI endpoint example
@app.post("/api/chat")
async def chat_endpoint(request: Request):
    data = await request.json()
    messages = data['messages']
    
    # Add rate limiting logic here
    # Add input sanitization
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        api_key=os.getenv("SECURE_API_KEY")
    )
    
     return {"reply": response.choices[0].message.content}
    )
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400)
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400)

    # Handle subscription changes
    if event['type'] == 'checkout.session.completed':
        handle_subscription_update(event)

    return {"status": "success"}
```

3. **Security Considerations**
- Always store API keys in environment variables
- Use HTTPS for all client-server communication
- Implement input validation/sanitization
- Use HTTPS for all auth endpoints
- Regular security audits

---

## 7. Implementing Real-Time Chat Collaboration

To add a chat component that integrates with AI suggestions:

1. **Enable Chat in Editor Options**:
```typescript
// In your Umo Editor configuration
assistant: {
  enabled: true,
  chat: {
    enabled: true,
    position: 'right-sidebar', // or 'floating'
    defaultPrompt: 'How can I improve this text?',
    historyLength: 10
  }
}
```
## 7. User Authentication and Subscription Management

Implement robust auth systems to handle both free and premium users.

### 7.1 Authentication Strategies

**Non-Paid Users:**
- Email/password with JWT
- Social logins (Google, GitHub)
- Anonymous sessions

**Paid Users:**
- Subscription-based access
- Role-based permissions
- Payment gateway integration

```tsx
// Frontend auth context
interface User {
  id: string;
  email: string;
  tier: 'free' | 'pro';
  subscriptionId?: string;
}

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', {email, password});
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  // Add social login handlers
  {{...}}
};
### 7.2 Backend Implementation (Python)

```python
# FastAPI authentication middleware
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user(user_id)
    if user is None:
        raise credentials_exception
    return user

# Subscription check middleware
def require_pro_tier(user: User = Depends(get_current_user)):
    if user.tier != 'pro':
        raise HTTPException(status_code=403, detail="Pro tier required")
    return user
```

### 7.3 Payment Gateway Integration

**Example Stripe Webhook:**
```python
@app.post("/stripe-webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400)
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400)

    # Handle subscription changes
    if event['type'] == 'checkout.session.completed':
        handle_subscription_update(event)

    return {"status": "success"}
```

### 7.4 Security Considerations
- Store passwords with bcrypt
- Use HTTPS for all auth endpoints
- Implement refresh token rotation
- PCI DSS compliance for payment handling
- Regular security audits

---
# WebSocket endpoint for real-time chat
@app.websocket("/chat/{document_id}")
async def chat_endpoint(websocket: WebSocket, document_id: str):
    await websocket.accept()
    chat_history = []
    
    while True:
        data = await websocket.receive_json()
        # Process message with AI model
        response = ai_model.generate_response(
            text=data['message'],
            context=data['selectedText'],
            history=chat_history
        )
        
        # Store and return response
        chat_history.append((data['message'], response))
        await websocket.send_json({
            "response": response,
            "suggestions": ai_model.get_edits(data['selectedText'])
        })
```

3. **Frontend Chat Component** in Vue:
```vue
// src/components/assistant/chat.vue
<template>
  <div class="chat-container">
    <div v-for="(msg, index) in history" :key="index">
      <div class="user-msg">{{ msg.question }}</div>
      <div class="ai-msg">{{ msg.response }}</div>
      <button @click="applySuggestion(msg.suggestion)">Apply</button>
    </div>
    <input v-model="currentMessage" @keyup.enter="sendMessage"/>
  </div>
</template>
```

## 7. Architectural Considerations

**Why No Existing Backend?**
Umo Editor focuses on frontend flexibility to:
- Support multiple backend implementations
- Enable cloud/self-hosted deployments
- Allow integration with existing SaaS platforms

**Core AI Integration Points**:
1. Chat Service WebSocket (real-time comms)
2. Document Versioning (for suggestion tracking)
3. User Session Management
4. Rate Limiting/Cost Controls for AI API calls
### 9.1 Frontend Save Handling --> TODO for the future
```tsx
// In Umo Editor options
onSave: async (documentState) => {
  try {
    const response = await axios.post('/api/documents/save', {
      content: documentState.content,
      metadata: documentState.metadata
    }, {
      headers: {Authorization: `Bearer ${userToken}`}
    });
    
    if(response.data.success) {
      showSaveIndicator('success');
    }
  } catch (error) {
    showSaveIndicator('error');
  }
}
TODO
# Document storage service
from clickhouse_driver import Client as ClickhouseClient

class DocumentStorage:
    def __init__(self):
        self.pool = ConnectionPool(
            lambda: ClickhouseClient(
                host=CLICKHOUSE_HOST,
                user=CLICKHOUSE_USER,
                password=CLICKHOUSE_PASS,
                database='documents',
                compression=True
            ),
            max_size=10
        )

    async def save_document(self, user_id: UUID, document: DocumentSchema):
        async with self.pool.acquire() as conn:
            await conn.execute(
                '''INSERT INTO documents 
                (id, user_id, content, metadata, created_at, updated_at)
                VALUES''',
                [{
                    'id': document.id,
                    'user_id': user_id,
                    'content': document.content,
                    'metadata': json.dumps(document.metadata),
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow()
                }]
            )
```

### 9.3 Schema Design Considerations
```sql
CREATE TABLE documents
(
    id UUID,
    user_id UUID,
    content String,
    metadata String,
    created_at DateTime64(3),
    updated_at DateTime64(3)
)
ENGINE = MergeTree
ORDER BY (user_id, created_at)
TODO
## 9. Minimum Necessary Testing Setup

### Backend Setup (Python FastAPI)

1. Install requirements:
```bash
pip install fastapi uvicorn python-multipart python-docx
```

2. Create `main.py`:
```python
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from docx import Document
import os

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_docx(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    return {"filename": file.filename, "url": f"/static/{file.filename}"}

@app.get("/documents")
async def list_documents():
    return {"files": os.listdir(UPLOAD_DIR)}
```

3. Run backend:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Create `static/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="/path/to/umo-editor.umd.js"></script>
</head>
<body>
    <div id="app">
        <umo-editor 
            :on-save="handleSave"
            :on-file-upload="handleFileUpload"
            file-extensions="docx"
        ></umo-editor>
    </div>

    <script>
        const { createApp } = Vue;

        createApp({
            methods: {
                async handleSave(content) {
                    const blob = new Blob([content], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
                    const file = new File([blob], 'document.docx');
                    await this.handleFileUpload(file);
                },

                async handleFileUpload(file) {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch('http://localhost:8000/upload', {
                        method: 'POST',
                        body: formData
                    });

                    return response.json();
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
```

### Testing Workflow

1. Start backend server:
```bash
uvicorn main:app --reload
```

2. Open frontend in browser:
```
http://localhost:8000/static/index.html
```

3. Test document operations:
- Upload DOCX via toolbar upload button
- Edit document content
- Save as DOCX (auto-uploads to backend)
- Verify files in `uploads/` directory

### Requirements

- Python 3.8+
- Node.js 16+
- Modern web browser

---

## 10. Conclusion and Further Steps

This guide has provided a comprehensive overview of Umo Editor, bridging the gap for you as a Python developer to understand its frontend technologies and integration into your Svelte SaaS platform.

1.  **Build Umo Editor**: Follow Step 1 and 2 of "Iframe Integration Steps" to build Umo Editor and host the static files.
2.  **Embed in Svelte**: Implement Step 3 and 4 to embed Umo Editor into your Svelte application using an iframe.
3.  **Implement Callbacks**:  Focus on implementing the `onSave`, `onFileUpload`, and **`onAssistant`** callbacks to connect Umo Editor to your SaaS backend.  Start with basic implementations and then enhance them.
4.  **Customize AI Commands**:  Customize the `commands` array in the `assistant` options to offer the specific AI functionalities you want in your SaaS platform.
5.  **Backend AI Integration**: Set up your Python backend to handle AI requests from Umo Editor, integrate with an AI service, and return AI-generated text.
6.  **Explore Further Customization**:  Once you have the basic integration working, explore other customization options in `src/options.ts` to fine-tune Umo Editor's behavior and appearance.
7.  **Consult Documentation**: Refer to the official Umo Editor documentation ([https://editor.umodoc.com/en/docs](https://editor.umodoc.com/en/docs)) for more in-depth information and advanced features.
8.  **Community**: Engage with the Umo Editor community (GitHub Discussions, Issues) if you have questions or need further assistance.

By following these steps, you'll be well on your way to integrating Umo Editor's powerful rich-text editing and AI capabilities into your Svelte SaaS platform. Good luck!

## Internationalization (i18n) and Language Customization

To support dynamic language changes in the project, implement the following:

- Integrate an i18n framework that enables dynamic language switching at runtime.
- Set the default language to English using US-standard fonts (e.g., Helvetica, Arial, or similar sans-serif fonts) to replace the current fonts that resemble Chinese typography.
- Provide an option to include Portuguese (Brazil) (ptBR) in the language settings. To add ptBR:
  1. Duplicate the language files from the existing English configuration (typically found under `src/locales/en`).
  2. Translate and adjust the translation keys accordingly, and store them under a new directory `src/locales/ptbr`.
  3. Update the UI language switcher to include a ptBR option, making it consistent with the current language implementation.
- Ensure that these changes are dynamic and easily extendable for additional languages in the future.

## 8. Enhancements & Troubleshooting

### 8.1 Documentation Clarity and Completeness
- This guide was originally crafted for experienced Python developers transitioning to modern frontend technologies. To further enhance clarity, ensure that all code examples, configurations, and integration details are fully spelled out rather than truncated. 
- **Complete Examples:** Provide full example implementations for:
  - Using the Vue Composition API within Umo Editor.
  - Embedding Umo Editor inside a Svelte application via an iframe, including communication between the iframe and the host.
  - Implementing backend callbacks (e.g., `onSave`, `onAssistant`) for persistent storage and AI integration.
- Detailed examples improve maintainability, reduce ambiguity, and accelerate developer onboarding.

### 8.2 Localization Enhancements and Additional Languages
- Currently, the project includes only the Russian locale ([ru-RU.ts]). To broaden the user base, the following locales will be supported:
  - **Brazilian Portuguese (pt-BR or ptbr):** Create a new file named `pt-BR.ts` (or `ptbr.ts`) in the `/src/locales/td-next-vue/` directory that follows the structure of [ru-RU.ts].
  - **US English (en-US or enus):** Similarly, add an `en-US.ts` (or `enus.ts`) file in the same directory.
- **Action Required:** Use the Russian translation file as a baseline to ensure consistency across all locales. This will align with global localization standards and broaden the market reach.

### 8.3 Fonts Management
- **Observation:** A review of [vite.config.ts], [tsconfig.json], and [jsconfig.json] indicates that there is no explicit management or import of fonts within the project source code.
- **Current Setup:** The build configuration in `vite.config.ts` imports a global CSS file (via the Rollup `intro` directive: `import './style.css'`), which likely handles font inclusion, potentially through external `<link>` tags in `index.html`.
- **Recommendation:** 
  - Verify if fonts are loaded via a global stylesheet or externally in the main HTML file. 
  - If custom fonts are needed within the project, add a dedicated CSS file with `@font-face` declarations and ensure it is imported globally. 
  - Alternatively, update the `index.html` with appropriate `<link>` tags to load fonts from a CDN or local assets.

### 8.4 Fixing i18n Configuration Issues
- **Problem:** The i18n Ally plugin is unable to locate the i18n configuration and translation files, which can hinder internationalization efforts.
- **Possible Causes:**
  1. There is no dedicated i18n configuration file (e.g., `i18n.config.js`) in the project root.
  2. The translation files in `/src/locales/td-next-vue/` are not referenced in the project’s configuration files (tsconfig.json/jsconfig.json).
- **Solution:**
  - **Create an i18n Configuration File:** Add an `i18n.config.js` in the project root with content such as:
    ```js
    module.exports = {
      locales: ['ru-RU', 'pt-BR', 'en-US'],
      directory: './src/locales/td-next-vue/',
    };
    ```
  - **Update TypeScript Configurations:** Ensure that both tsconfig.json and jsconfig.json include the locales directory in their path resolution.
  - **Plugin Configuration:** If using vue-i18n or similar plugins, verify that they are properly configured in `vite.config.ts` and imported in the main entry file. 
  - This will allow the i18n Ally plugin to detect the configuration and locate the translation files correctly.

### 8.5 Next Steps for Implementation
1. **Documentation:** Update this guide with the detailed examples and steps outlined above to eliminate any ambiguity.
2. **Localization:** Create stub translation files for Brazilian Portuguese (`pt-BR.ts`/`ptbr.ts`) and US English (`en-US.ts`/`enus.ts`) in `/src/locales/td-next-vue/` using the structure from [ru-RU.ts].
3. **Fonts:** Confirm and update the global CSS or `index.html` to explicitly load the required fonts, either by adding `<link>` tags or a dedicated CSS file with `@font-face` rules.
4. **i18n Configuration:** Create an `i18n.config.js` in the project root and update your tsconfig.json and jsconfig.json accordingly. Also, ensure that any i18n plugins are correctly configured in `vite.config.ts`.

By incorporating these additional measures, the project will benefit from improved documentation clarity, expanded localization support, explicit font management, and a robust i18n configuration that allows the i18n Ally plugin to function correctly.

## 9. Additional Guidance and Complete Code Examples

While this guide is intended for experienced developers, we recognize that clarity and comprehensiveness benefit everyone. To accommodate varied levels of familiarity with advanced frontend concepts, please consider the following enhancements:

### 9.1 Beginner-Friendly References and Context
- **Vue Composition API:**
  - We assume familiarity with the Composition API; however, beginners may benefit from additional context. We recommend reviewing the official [Vue Composition API documentation](https://vuejs.org/guide/extras/composition-api-faq.html) and exploring introductory tutorials available on the Vue website or community blogs.
  - For an in-depth walkthrough, consider the article "Getting Started with Vue Composition API" on [Vue Mastery](https://www.vuemastery.com/) or similar platforms.

- **Iframe Integration Strategies:**
  - The guide explains iframe embedding as a simpler integration strategy for using Umo Editor in a Svelte application. For those new to this approach, additional reading on secure cross-document messaging (using `postMessage`) and proper iframe sandboxing is recommended. Good starting points include the [MDN Web Docs on Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) and articles on iframe security best practices.

### 9.2 Ensuring Complete and Self-contained Code Examples
- In certain parts of this document, code snippets have been abbreviated (e.g., indicated by "[... more lines not shown ...]"). To avoid ambiguity and ensure that every critical instruction is fully visible:
  - **Include Full Examples:** Reconstruct all essential code examples so that they are self-contained. For instance, when describing backend callbacks (like `onSave` or `onAssistant`), provide full source context including imports, function definitions, and error handling routines.
  - **Avoid Truncated References:** When quoting snippets, ensure that all lines that may affect the functionality are included. If a code snippet is too lengthy for the guide, provide a link to a repository or an appendix with the complete version.
  - **Supplementary Material:** A comprehensive appendix or separate documentation file may be maintained and referenced here for very detailed examples. This ensures that any omitted parts are accessible to those who require the full context.

### 9.3 Practical Implementation Suggestions
- **Review and Update Code Examples Regularly:** Ensure that as the project evolves, the documentation is updated to reflect any changes in code, configuration, or integration strategies. This includes revisiting the full example code sections and verifying that none of the critical steps are lost in abbreviated form.
- **Feedback Loop:** Encourage developers to provide feedback on which sections might be unclear, and consider adding inline comments or reference links directly in the examples.
- **Further Reading:** Besides the provided references, consider additional sources such as:
  - [Vue.js Official Guide](https://vuejs.org/guide/introduction.html)
  - [Tiptap Documentation](https://tiptap.dev/)
  - [MDN Web Docs on iframes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)

By incorporating these additional measures, the guide will become more accessible to developers at all skill levels, ensuring that critical instructions are always fully visible and unambiguous.

## 8. Advanced Configuration Options

The `options.ts` file provides granular control over editor behavior. Key configurations include:

### AI Integration
```typescript
aiAssistant: {
  endpoint: 'https://your-backend.com/ai',
  headers: {
    'Authorization': 'Bearer ${token}'
  },
  commands: ['rewrite', 'summarize', 'expand']
}
```

### Custom Extensions
```typescript
extensions: [
  customParagraph,
  advancedTable,
  aiAssistant
]
```

## 9. Extension Development Guide

Create custom extensions in `/src/extensions`:
1. Inherit from Tiptap's Extension class
2. Implement schema and commands
3. Register in `options.ts`

## 10. Composables API

Reusable logic modules:
- `useDocumentPersistance()`: Auto-save functionality
- `useAIIntegration()`: Handles AI service communication
- `useCollaboration()`: Real-time co-editing features
```
TODO:

### .npmrc Configuration
```ini
# Secure credential storage
@secure:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
clickhouse_driver_version=^0.2.5
openai_version=^3.2.0
```

### Rate Limiting Middleware

```
## 9. Minimum Necessary Testing Setup

### Backend Setup (Python FastAPI)

1. Install requirements:
```bash
pip install fastapi uvicorn python-multipart python-docx
```

2. Create `main.py`:
```python
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from docx import Document
import os

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_docx(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    return {"filename": file.filename, "url": f"/static/{file.filename}"}

@app.get("/documents")
async def list_documents():
    return {"files": os.listdir(UPLOAD_DIR)}
```

3. Run backend:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Create `static/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="/path/to/umo-editor.umd.js"></script>
</head>
<body>
    <div id="app">
        <umo-editor 
            :on-save="handleSave"
            :on-file-upload="handleFileUpload"
            file-extensions="docx"
        ></umo-editor>
    </div>

    <script>
        const { createApp } = Vue;

        createApp({
            methods: {
                async handleSave(content) {
                    const blob = new Blob([content], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
                    const file = new File([blob], 'document.docx');
                    await this.handleFileUpload(file);
                },

                async handleFileUpload(file) {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch('http://localhost:8000/upload', {
                        method: 'POST',
                        body: formData
                    });

                    return response.json();
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
```

### Testing Workflow

1. Start backend server:
```bash
uvicorn main:app --reload
```

2. Open frontend in browser:
```
http://localhost:8000/static/index.html
```

3. Test document operations:
- Upload DOCX via toolbar upload button
- Edit document content
- Save as DOCX (auto-uploads to backend)
- Verify files in `uploads/` directory

### Requirements

- Python 3.8+
- Node.js 16+
- Modern web browser
