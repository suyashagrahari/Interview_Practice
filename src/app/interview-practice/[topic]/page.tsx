"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  XCircle,
  Search,
  Code,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import FloatingActionButton from "@/components/ui/floating-action-button";
import ParticleBackground from "@/components/ui/particle-background";
// Removed Toast notifications

// Custom scrollbar styles
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(156, 163, 175, 0.1);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(75, 85, 99, 0.3);
  }
  
  .custom-scrollbar-thin::-webkit-scrollbar {
    width: 4px
  }
  
  .custom-scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar-thin::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

interface Question {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Expert";
  answer: string;
  keyPoints: string[];
  example?: string;
  explanation?: string;
}

interface TopicContent {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  participants: number;
  rating: number;
  questions: Question[];
}

const TopicPage = () => {
  const params = useParams();
  const router = useRouter();
  const [topic, setTopic] = useState<TopicContent | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "Beginner" | "Intermediate" | "Expert"
  >("Beginner");
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(
    new Set()
  );
  // Removed toast state and helpers

  const topicsData: Record<string, TopicContent> = {
    javascript: {
      id: "javascript",
      title: "JavaScript",
      description:
        "Master the fundamentals and advanced concepts of JavaScript programming language.",
      icon: <Code className="w-8 h-8" />,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      category: "frontend",
      difficulty: "Beginner",
      duration: "8-12 hours",
      participants: 15420,
      rating: 4.8,
      questions: [
        {
          id: "js-1",
          title: "What is JavaScript?",
          difficulty: "Beginner",
          answer:
            "JavaScript is a high-level, interpreted programming language primarily used for creating interactive effects within web browsers. It allows developers to add dynamic behavior to web pages, handle events, manipulate the DOM, and communicate with servers. JavaScript is also used in server-side development (Node.js), mobile app development, and game development.",
          keyPoints: [
            "Versatile language for front-end and back-end development",
            "Dynamically typed with runtime type checking",
            "Object-oriented programming support",
            "Rich ecosystem of libraries and frameworks",
          ],
          example: "alert('Hello, World!');",
          explanation:
            "This code will display a popup box with the message 'Hello, World!' when the web page is loaded.",
        },
        {
          id: "js-2",
          title: "What are variables in JavaScript?",
          difficulty: "Beginner",
          answer:
            "Variables in JavaScript are containers for storing data values. They are declared using keywords like 'var', 'let', or 'const'. Variables can hold different types of data including numbers, strings, booleans, objects, and functions. They provide a way to store and manipulate data throughout your program.",
          keyPoints: [
            "Variables store data values",
            "Three declaration keywords: var, let, const",
            "Can hold different data types",
            "Provide data persistence and manipulation",
          ],
          example: `let name = "John";
const age = 25;
var isStudent = true;`,
          explanation:
            "This example shows three different ways to declare variables: 'let' for mutable values, 'const' for constants, and 'var' for function-scoped variables.",
        },
        {
          id: "js-3",
          title: "What are data types in JavaScript?",
          difficulty: "Beginner",
          answer:
            "JavaScript has several primitive data types: Number (integers and decimals), String (text), Boolean (true/false), Undefined (variable declared but not assigned), Null (intentional absence of value), Symbol (unique identifier), and BigInt (large integers). JavaScript also has reference types like Object, Array, and Function.",
          keyPoints: [
            "Primitive types: Number, String, Boolean, Undefined, Null, Symbol, BigInt",
            "Reference types: Object, Array, Function",
            "Dynamically typed language",
            "Type checking at runtime",
          ],
          example: `let number = 42;
let text = "Hello World";
let boolean = true;
let array = [1, 2, 3];
let object = { name: "John", age: 25 };`,
          explanation:
            "This example demonstrates different data types in JavaScript, showing how variables can hold various types of values.",
        },
        {
          id: "js-4",
          title: "What are functions in JavaScript?",
          difficulty: "Beginner",
          answer:
            "Functions in JavaScript are reusable blocks of code that perform specific tasks. They can take parameters (input) and return values (output). Functions help organize code, avoid repetition, and make programs more modular. They can be declared using function declarations, function expressions, or arrow functions.",
          keyPoints: [
            "Reusable blocks of code",
            "Can take parameters and return values",
            "Help organize and modularize code",
            "Multiple declaration syntaxes available",
          ],
          example: `function greet(name) {
  return "Hello, " + name + "!";
}

const greetArrow = (name) => "Hello, " + name + "!";

console.log(greet("John")); // Hello, John!
console.log(greetArrow("Jane")); // Hello, Jane!`,
          explanation:
            "This shows two ways to create functions: traditional function declaration and modern arrow function syntax.",
        },
        {
          id: "js-5",
          title: "What are arrays in JavaScript?",
          difficulty: "Beginner",
          answer:
            "Arrays in JavaScript are ordered collections of values that can hold multiple items of any data type. They are zero-indexed, meaning the first element is at index 0. Arrays provide many built-in methods for manipulation like push(), pop(), shift(), unshift(), and more. They are commonly used for storing lists of data.",
          keyPoints: [
            "Ordered collections of values",
            "Zero-indexed (start at position 0)",
            "Can hold mixed data types",
            "Many built-in methods for manipulation",
          ],
          example: `let fruits = ["apple", "banana", "orange"];
fruits.push("grape"); // Add to end
fruits.pop(); // Remove from end
console.log(fruits[0]); // apple`,
          explanation:
            "This example shows basic array operations: creating an array, adding elements, removing elements, and accessing elements by index.",
        },
        {
          id: "js-6",
          title: "What are objects in JavaScript?",
          difficulty: "Beginner",
          answer:
            "Objects in JavaScript are collections of key-value pairs where keys are strings (or symbols) and values can be any data type. They are used to represent real-world entities and group related data and functionality together. Objects can have properties (data) and methods (functions).",
          keyPoints: [
            "Collections of key-value pairs",
            "Keys are strings or symbols",
            "Values can be any data type",
            "Can have properties and methods",
          ],
          example: `let person = {
  name: "John",
  age: 30,
  greet: function() {
    return "Hello, I'm " + this.name;
  }
};

console.log(person.name); // John
console.log(person.greet()); // Hello, I'm John`,
          explanation:
            "This object has properties (name, age) and a method (greet function) that can access the object's properties using 'this'.",
        },
        {
          id: "js-7",
          title: "What is the difference between == and ===?",
          difficulty: "Beginner",
          answer:
            "The == operator performs type coercion before comparison, while === (strict equality) checks both value and type without coercion. === is generally preferred as it's more predictable and prevents unexpected type conversions that can lead to bugs. Always use === unless you specifically need type coercion.",
          keyPoints: [
            "== performs type coercion",
            "=== checks value and type strictly",
            "=== is more predictable and safer",
            "Use === for most comparisons",
          ],
          example: `5 == '5';   // true (type coercion)
5 === '5';  // false (different types)
null == undefined;  // true
null === undefined; // false`,
          explanation:
            "The == operator converts the string '5' to a number before comparison, while === requires both value and type to match exactly.",
        },
        {
          id: "js-8",
          title: "What are conditional statements?",
          difficulty: "Beginner",
          answer:
            "Conditional statements in JavaScript allow you to execute different blocks of code based on whether certain conditions are true or false. The main conditional statements are 'if', 'else if', and 'else'. They use comparison operators and logical operators to evaluate conditions and control program flow.",
          keyPoints: [
            "Control program flow based on conditions",
            "Use if, else if, and else keywords",
            "Evaluate boolean expressions",
            "Can be nested for complex logic",
          ],
          example: `let age = 18;

if (age >= 18) {
  console.log("You are an adult");
} else if (age >= 13) {
  console.log("You are a teenager");
} else {
  console.log("You are a child");
}`,
          explanation:
            "This example shows how conditional statements can check different age ranges and execute different code based on the condition.",
        },
        {
          id: "js-9",
          title: "What are loops in JavaScript?",
          difficulty: "Beginner",
          answer:
            "Loops in JavaScript are used to execute a block of code multiple times. The main types are 'for' loops (when you know the number of iterations), 'while' loops (when you don't know the number of iterations), and 'do-while' loops (execute at least once). Loops are essential for processing arrays and repeating operations.",
          keyPoints: [
            "Execute code blocks multiple times",
            "For loops for known iterations",
            "While loops for unknown iterations",
            "Essential for array processing",
          ],
          example: `// For loop
for (let i = 0; i < 5; i++) {
  console.log("Count: " + i);
}

// While loop
let count = 0;
while (count < 3) {
  console.log("Count: " + count);
  count++;
}`,
          explanation:
            "The for loop runs exactly 5 times, while the while loop continues until the condition becomes false.",
        },
        {
          id: "js-10",
          title: "What is scope in JavaScript?",
          difficulty: "Beginner",
          answer:
            "Scope in JavaScript determines the accessibility of variables, functions, and objects in different parts of your code. There are three main types: Global scope (accessible everywhere), Function scope (accessible within a function), and Block scope (accessible within blocks like if statements, loops). Understanding scope is crucial for avoiding variable conflicts.",
          keyPoints: [
            "Determines variable accessibility",
            "Global, function, and block scope",
            "Variables declared with 'let' and 'const' are block-scoped",
            "Variables declared with 'var' are function-scoped",
          ],
          example: `let globalVar = "I'm global";

function myFunction() {
  let functionVar = "I'm function-scoped";
  if (true) {
    let blockVar = "I'm block-scoped";
    console.log(blockVar); // Works
  }
  // console.log(blockVar); // Error - not accessible
}`,
          explanation:
            "This demonstrates different scopes: globalVar is accessible everywhere, functionVar only in the function, and blockVar only in the if block.",
        },
      ],
    },
    react: {
      id: "react",
      title: "React",
      description:
        "Build dynamic and interactive user interfaces with React library.",
      icon: <Code className="w-8 h-8" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      category: "frontend",
      difficulty: "Intermediate",
      duration: "10-15 hours",
      participants: 12850,
      rating: 4.9,
      questions: [
        {
          id: "react-1",
          title: "What is React and why use it?",
          difficulty: "Beginner",
          answer:
            "React is a JavaScript library for building user interfaces, particularly single-page applications. It's used for handling the view layer and can be used for developing both web and mobile applications. React allows developers to create large web applications that can change data without reloading the page.",
          keyPoints: [
            "Component-based architecture",
            "Virtual DOM for performance",
            "Unidirectional data flow",
            "Large ecosystem and community",
          ],
          example: `function Welcome() {
  return <h1>Hello, React!</h1>;
}`,
          explanation:
            "This is a simple React functional component that returns JSX to render a heading element.",
        },
        {
          id: "react-2",
          title: "What are React components?",
          difficulty: "Beginner",
          answer:
            "React components are reusable pieces of UI that can be composed together to build complex interfaces. Components can be functional (using functions) or class-based (using classes). They accept props as input and return JSX to describe what should appear on the screen. Components help organize code and make it more maintainable.",
          keyPoints: [
            "Reusable pieces of UI",
            "Can be functional or class-based",
            "Accept props as input",
            "Return JSX for rendering",
          ],
          example: `function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Greeting name="John" />`,
          explanation:
            "This functional component takes a 'name' prop and renders a personalized greeting message.",
        },
        {
          id: "react-3",
          title: "What is JSX in React?",
          difficulty: "Beginner",
          answer:
            "JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript. It makes React components more readable and easier to write. JSX gets transformed into regular JavaScript function calls during the build process. It allows you to embed expressions, use attributes, and nest elements just like HTML.",
          keyPoints: [
            "JavaScript XML syntax extension",
            "HTML-like syntax in JavaScript",
            "Gets transformed to JavaScript",
            "Allows embedding expressions",
          ],
          example: `const name = "John";
const element = <h1>Hello, {name}!</h1>;

// JSX with attributes
const button = <button className="btn" onClick={handleClick}>Click me</button>;`,
          explanation:
            "JSX allows you to mix JavaScript expressions with HTML-like syntax, making it easy to create dynamic content.",
        },
        {
          id: "react-4",
          title: "What are React props?",
          difficulty: "Beginner",
          answer:
            "Props (short for properties) are a way to pass data from parent components to child components in React. They are read-only and help make components reusable and configurable. Props can be any type of data: strings, numbers, arrays, objects, or even functions. They are passed down the component tree and cannot be modified by the receiving component.",
          keyPoints: [
            "Pass data between components",
            "Read-only (immutable)",
            "Make components reusable",
            "Can be any data type",
          ],
          example: `function UserCard(props) {
  return (
    <div className="user-card">
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      <p>Email: {props.email}</p>
    </div>
  );
}

// Usage
<UserCard name="John" age={25} email="john@example.com" />`,
          explanation:
            "Props allow the parent component to customize how the UserCard component is displayed with different data.",
        },
        {
          id: "react-5",
          title: "What is React state?",
          difficulty: "Beginner",
          answer:
            "State in React is a way to store data that can change over time and affects how a component renders. When state changes, the component re-renders to reflect the new data. State is managed within the component and can be updated using setter functions. It's essential for creating interactive components that respond to user actions.",
          keyPoints: [
            "Stores changeable data",
            "Triggers re-renders when updated",
            "Managed within component",
            "Updated with setter functions",
          ],
          example: `function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
          explanation:
            "The count state starts at 0 and increases each time the button is clicked, causing the component to re-render with the new value.",
        },
        {
          id: "react-6",
          title: "Explain React Hooks",
          difficulty: "Intermediate",
          answer:
            "React Hooks are functions that allow you to use state and other React features in functional components. They were introduced in React 16.8 to allow you to use state and lifecycle methods without writing a class component. Common hooks include useState, useEffect, useContext, and useReducer.",
          keyPoints: [
            "Only call hooks at the top level",
            "Only call hooks from React functions",
            "Hooks must be called in the same order",
            "Custom hooks must start with 'use'",
          ],
          example: `function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
          explanation:
            "useState manages the count state, and useEffect updates the document title whenever count changes.",
        },
      ],
    },
    nodejs: {
      id: "nodejs",
      title: "Node.js",
      description:
        "Develop scalable and efficient server-side applications with Node.js runtime.",
      icon: <Code className="w-8 h-8" />,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      category: "backend",
      difficulty: "Intermediate",
      duration: "12-18 hours",
      participants: 9850,
      rating: 4.7,
      questions: [
        {
          id: "node-1",
          title: "What is Node.js?",
          difficulty: "Beginner",
          answer:
            "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server-side, enabling the development of scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.",
          keyPoints: [
            "JavaScript runtime on server-side",
            "Event-driven and non-blocking I/O",
            "Built on V8 engine",
            "Large package ecosystem (npm)",
          ],
          example: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});`,
          explanation:
            "This creates a simple HTTP server that responds with 'Hello World' to all requests on port 3000.",
        },
        {
          id: "node-2",
          title: "What is npm in Node.js?",
          difficulty: "Beginner",
          answer:
            "npm (Node Package Manager) is the default package manager for Node.js. It allows developers to install, update, and manage JavaScript packages and dependencies for their projects. npm provides access to the world's largest software registry and helps manage project dependencies efficiently.",
          keyPoints: [
            "Default package manager for Node.js",
            "Installs and manages dependencies",
            "Largest software registry",
            "Manages project packages",
          ],
          example: `# Install a package
npm install express

# Install as dev dependency
npm install --save-dev nodemon

# Initialize a new project
npm init`,
          explanation:
            "npm commands help manage packages: install for dependencies, --save-dev for development tools, and init to create package.json.",
        },
        {
          id: "node-3",
          title: "What is package.json?",
          difficulty: "Beginner",
          answer:
            "package.json is a configuration file that contains metadata about a Node.js project. It includes information like project name, version, description, dependencies, scripts, and other project settings. This file is essential for Node.js projects as it defines how the project should be built, what dependencies it needs, and how to run it.",
          keyPoints: [
            "Project configuration file",
            "Contains metadata and dependencies",
            "Defines project scripts",
            "Essential for Node.js projects",
          ],
          example: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample Node.js project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  }
}`,
          explanation:
            "This package.json defines project details, scripts for running the app, and lists Express as a dependency.",
        },
        {
          id: "node-4",
          title: "What are modules in Node.js?",
          difficulty: "Beginner",
          answer:
            "Modules in Node.js are reusable pieces of code that can be imported and used in other files. They help organize code by separating functionality into different files. Node.js uses the CommonJS module system where you can export code using module.exports and import it using require(). This modular approach makes code more maintainable and reusable.",
          keyPoints: [
            "Reusable pieces of code",
            "Separate functionality into files",
            "Use CommonJS module system",
            "Export with module.exports",
          ],
          example: `// math.js
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// app.js
const math = require('./math');
console.log(math.add(5, 3)); // 8`,
          explanation:
            "The math module exports functions that can be imported and used in other files using require().",
        },
        {
          id: "node-5",
          title: "What is the event loop in Node.js?",
          difficulty: "Beginner",
          answer:
            "The event loop is a mechanism that allows Node.js to perform non-blocking I/O operations despite being single-threaded. It continuously processes events from the event queue and executes callbacks. The event loop handles operations like file I/O, network requests, and timers asynchronously, making Node.js efficient for I/O-intensive applications.",
          keyPoints: [
            "Enables non-blocking operations",
            "Single-threaded execution",
            "Processes events asynchronously",
            "Handles I/O operations efficiently",
          ],
          example: `console.log('Start');

setTimeout(() => {
  console.log('Timer callback');
}, 1000);

console.log('End');

// Output: Start, End, Timer callback (after 1 second)`,
          explanation:
            "The event loop processes the timer callback asynchronously, allowing other code to execute while waiting.",
        },
      ],
    },
  };

  useEffect(() => {
    const topicId = params.topic as string;
    if (topicsData[topicId]) {
      const topicData = topicsData[topicId];
      setTopic(topicData);
      // Set first question as selected
      if (topicData.questions.length > 0) {
        setSelectedQuestion(topicData.questions[0].id);
      }
    }
  }, [params.topic]);

  // Handle scroll-based question switching
  useEffect(() => {
    const handleScroll = () => {
      const questions = document.querySelectorAll('[id^="question-"]');
      const windowHeight = window.innerHeight;
      const scrollContainer = document.querySelector(".custom-scrollbar");

      if (!scrollContainer) return;

      questions.forEach((questionEl) => {
        const rect = questionEl.getBoundingClientRect();
        const questionId = questionEl.id.replace("question-", "");

        // Check if question is in the center of the viewport
        const questionCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;

        // If question center is within 200px of viewport center, select it
        if (Math.abs(questionCenter - viewportCenter) < 200) {
          setSelectedQuestion(questionId);
        }
      });
    };

    // Listen to scroll events on the questions container
    const scrollContainer = document.querySelector(".custom-scrollbar");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }

    // Fallback to window scroll if container not found
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <ParticleBackground />
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Topic not found
            </h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredQuestions = topic.questions.filter(
    (q) =>
      q.difficulty === selectedDifficulty &&
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentQuestion = topic.questions.find(
    (q) => q.id === selectedQuestion
  );

  const toggleQuestionCompletion = (questionId: string) => {
    const newCompleted = new Set(completedQuestions);
    if (newCompleted.has(questionId)) {
      newCompleted.delete(questionId);
    } else {
      newCompleted.add(questionId);
    }
    setCompletedQuestions(newCompleted);
  };

  const scrollToQuestion = (questionId: string) => {
    const questionElement = document.getElementById(`question-${questionId}`);
    if (questionElement) {
      const scrollContainer = document.querySelector(".custom-scrollbar");
      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const questionRect = questionElement.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop;
        const targetScrollTop =
          scrollTop + questionRect.top - containerRect.top - 100;

        scrollContainer.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    }
  };

  const getProgressPercentage = () => {
    const totalQuestions = topic.questions.length;
    const completedCount = completedQuestions.size;
    return Math.round((completedCount / totalQuestions) * 100);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customScrollbarStyles }} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <ParticleBackground />
        <Navigation />

        {/* Main Content */}
        <main className="pt-24 pb-16">
          <div className="w-full px-2 sm:px-4">
            {/* Topic Header - Ultra Compact Navbar Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4">
              <div className="bg-white/80 dark:bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 shadow-md">
                <div className="flex items-center justify-between">
                  {/* Left Side - Icon and Text */}
                  <div className="flex items-center space-x-3">
                    {/* Back Button */}
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      onClick={() => router.back()}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mb-8">
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back to Topics</span>
                    </motion.button>
                    <motion.div
                      className={`w-10 h-10 ${topic.bgColor} rounded-lg flex items-center justify-center ${topic.color}`}
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      transition={{ duration: 0.3 }}>
                      {topic.icon}
                    </motion.div>
                    <div>
                      <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                        {topic.title} Interview Questions
                      </h1>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Side - Progress and Stats */}
                  <div className="flex items-center space-x-4">
                    {/* Progress Circle - Even Smaller */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {getProgressPercentage()}%
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
                    </div>

                    {/* Compact Stats - Horizontal */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {topic.duration}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {topic.participants.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {topic.rating}/5.0
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-3 h-3 text-purple-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {topic.questions.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {/* Left Sidebar - Questions (Wider) */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-white/80 dark:bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 shadow-lg sticky top-24">
                  {/* Search Bar */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 bg-white/80 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    />
                  </div>

                  {/* Difficulty Tabs */}
                  <div className="flex flex-row space-x-2 mb-6">
                    {(["Beginner", "Intermediate", "Expert"] as const).map(
                      (difficulty) => (
                        <motion.button
                          key={difficulty}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedDifficulty(difficulty)}
                          className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex-1 border-2 ${
                            selectedDifficulty === difficulty
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md border-blue-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                          }`}>
                          {difficulty}
                        </motion.button>
                      )
                    )}
                  </div>

                  {/* Questions List */}
                  <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar-thin">
                    {filteredQuestions.map((question, index) => (
                      <motion.button
                        key={question.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        onClick={() => {
                          setSelectedQuestion(question.id);
                          scrollToQuestion(question.id);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 border-2 ${
                          selectedQuestion === question.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md border-blue-400"
                            : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                        }`}>
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                              selectedQuestion === question.id
                                ? "bg-white/20 scale-110"
                                : "bg-gray-100 dark:bg-gray-700 hover:scale-105"
                            }`}>
                            <span
                              className={`text-xs font-bold ${
                                selectedQuestion === question.id
                                  ? "text-white"
                                  : "text-gray-600 dark:text-gray-300"
                              }`}>
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium leading-tight line-clamp-3">
                              {question.title}
                            </div>
                            {completedQuestions.has(question.id) && (
                              <div className="flex items-center mt-1">
                                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                                <span className="text-xs text-green-600 dark:text-green-400">
                                  Completed
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Pane - All Questions Scrollable */}
              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/80 dark:bg-white/10 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-white/20 shadow-lg">
                  {/* Questions Container with Scroll */}
                  <div
                    className="max-h-[800px] overflow-y-auto custom-scrollbar p-8"
                    onScroll={(e) => {
                      const container = e.currentTarget;
                      const questions =
                        container.querySelectorAll('[id^="question-"]');

                      questions.forEach((questionEl) => {
                        const rect = questionEl.getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        const questionId = questionEl.id.replace(
                          "question-",
                          ""
                        );

                        // Calculate relative position within the scroll container
                        const relativeTop = rect.top - containerRect.top;
                        const containerHeight = containerRect.height;

                        // If question is in the center area of the container, select it
                        if (
                          relativeTop >= containerHeight * 0.2 &&
                          relativeTop <= containerHeight * 0.8
                        ) {
                          setSelectedQuestion(questionId);

                          // Auto-complete when scrolled to (for all questions)
                          if (!completedQuestions.has(questionId)) {
                            setTimeout(() => {
                              toggleQuestionCompletion(questionId);
                            }, 1500); // Slightly longer delay for better UX
                          }
                        }
                      });
                    }}>
                    {filteredQuestions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`mb-6 p-4 rounded-lg transition-all duration-300 ${
                          selectedQuestion === question.id
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800"
                            : "bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-white/20"
                        }`}
                        id={`question-${question.id}`}>
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              Q{index + 1}
                            </div>
                            <div>
                              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {question.title}
                              </h2>
                              <div className="flex items-center space-x-2 mt-1">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    question.difficulty === "Beginner"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                      : question.difficulty === "Intermediate"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                  }`}>
                                  {question.difficulty}
                                </span>
                                <button
                                  onClick={() =>
                                    toggleQuestionCompletion(question.id)
                                  }
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                    completedQuestions.has(question.id)
                                      ? "bg-green-500 border-green-500 text-white"
                                      : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                                  }`}>
                                  {completedQuestions.has(question.id) && (
                                    <CheckCircle className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Answer */}
                        <div className="mb-6">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                            Answer
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                            {question.answer}
                          </p>
                        </div>

                        {/* Key Points */}
                        {question.keyPoints && (
                          <div className="mb-6">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                              <Target className="w-4 h-4 text-blue-500 mr-2" />
                              Key Points
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {question.keyPoints.map((point, pointIndex) => (
                                <motion.div
                                  key={pointIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.5,
                                    delay: pointIndex * 0.1,
                                  }}
                                  className="flex items-start space-x-2 p-2 bg-white/80 dark:bg-white/10 rounded-lg border border-gray-200/50 dark:border-white/20">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span className="text-gray-700 dark:text-gray-300 text-xs">
                                    {point}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Example */}
                        {question.example && (
                          <div className="mb-6">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                              <Code className="w-4 h-4 text-green-500 mr-2" />
                              Example
                            </h3>
                            <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-3 overflow-x-auto">
                              <pre className="text-green-400 text-xs">
                                <code>{question.example}</code>
                              </pre>
                            </div>
                            {question.explanation && (
                              <p className="text-gray-600 dark:text-gray-400 text-xs mt-2 italic">
                                {question.explanation}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Progress Indicator */}
                        <div className="pt-4 border-t border-gray-200/50 dark:border-white/20">
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>
                              Question {index + 1} of {filteredQuestions.length}
                            </span>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {Math.round(
                                ((index + 1) / filteredQuestions.length) * 100
                              )}
                              % Complete
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${
                                  ((index + 1) / filteredQuestions.length) * 100
                                }%`,
                              }}
                              transition={{ duration: 0.8, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <FloatingActionButton />
      </div>
    </>
  );
};

export default TopicPage;
