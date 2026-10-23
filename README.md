# ୨୧ Chapter Journal ୨୧

A lightweight SillyTavern extension that turns long AI character conversations into editable chapters and searchable memory.

## What it does

- **You choose the chapter boundaries.** End a chapter from any message or at the latest message.
- **AI organizes the conversation.** It creates an editable title, summary, timeline, character changes, current state, clues, and unresolved threads.
- **Navigate long chats quickly.** Use the floating chapter index to jump back to important scenes.
- **Remember earlier events.** Saved chapters sync to the current chat's Lorebook for keyword retrieval and optional semantic retrieval with SillyTavern Vectors.
- **Keep stories separated.** Each chat has its own chapter memory, while Character Lorebooks continue to work alongside it.

## Preview

![Floating chapter navigation](assets/chapter-navigation.png)

![Editable chapter summary and timeline](assets/chapter-summary.png)

## Install

In SillyTavern, open **Extensions → Install Extension** and paste:

`https://github.com/wennshii/chapter-journal`

Then select **Install**.

## How to use

1. Select the book icon on a message, or choose **End at Latest Message** from the floating journal.
2. Review and edit the AI-generated chapter record.
3. Select **Save Chapter**. The chapter appears in the index and syncs to the chat's Lorebook.

An LLM connection is required to generate chapter records. Semantic retrieval is optional and requires SillyTavern Vectors; keyword retrieval works without it.

## License

AGPL-3.0-or-later.
