# Upload Topic Questions Feature

This feature allows users to create, manage, and publish topic-based interview questions through a comprehensive UI.

## Components

### UploadTopicQuestions

Main component that orchestrates the entire upload questions workflow.

### QuestionForm

Form component for creating and editing questions with:

- Topic name input
- Experience level selection (0-2, 3-4, 5-6, 7-8, 9-10 years)
- Difficulty level selection (Beginner, Intermediate, Expert)
- Question text area
- Expected answer text area
- Keywords management (add/remove)

### QuestionCards

Displays all created questions in card format with:

- Question preview
- Experience and difficulty badges
- Keywords display
- Edit and delete actions
- Creation date

### PublishModal

Confirmation modal for publishing questions with:

- Question selection (all/individual)
- Detailed question preview
- Publish/cancel actions

## Features

- **Responsive Design**: Works on all screen sizes
- **Dark/Light Theme**: Follows the application's theme system
- **Form Validation**: Ensures all required fields are filled
- **Keyword Management**: Easy add/remove of keywords
- **Question Editing**: Click edit to modify existing questions
- **Question Deletion**: Remove questions with confirmation
- **Bulk Selection**: Select all or individual questions for publishing
- **Smooth Animations**: Framer Motion animations throughout

## Usage

1. Navigate to the "Upload Topic Questions" tab in the sidebar
2. Fill out the question form on the left
3. View created questions on the right
4. Edit or delete questions as needed
5. Click "Publish" to review and confirm all questions
6. Select questions to publish and confirm

## Types

All TypeScript types are defined in `/types/upload-questions.ts`:

- `QuestionData`: Complete question structure
- `QuestionFormData`: Form data structure
- `ExperienceLevel`: Experience level options
- `DifficultyLevel`: Difficulty level options
- `PublishPayload`: Data structure for publishing
