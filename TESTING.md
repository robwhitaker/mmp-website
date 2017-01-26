# MMP Beta Test

## Overview

Welcome to testing, the game of breaking things! Your goal is to find bugs in the Reader application before it gets to actual readers. That means doing everything in your power to break things. And I mean everything. Zoom in and out of the page. Resize the window. Open it on mobile and chuck your phone across the room. Test it in every mode of every browser you can find. Turn pages as fast as you can. Jump between chapters. Everything.

Even if you think a user would never do something, do it anyway. I didn’t think a user would zoom out to 65% and turn the page forward on the last page of a chapter, but that caused a big error. And it wasn’t even directly related to being zoomed out. It occurred because some logic in the application actually didn’t handle having two headings on the last page---something that could entirely happen with normal use!

## Reporting a Bug

To report a bug, please [submit an issue](https://github.com/robwhitaker/MMPWebsiteV2/issues/new). 

**Note:** _Before posting a bug, please check to make sure no one else already reported it. If someone else reported it, but you feel you have more information to add, please leave that information as a comment on the original issue._

For the title, choose something concise yet descriptive---something that will tell me what the bug is without going into detail on it.

In the description, please include:
- **The device, operating system, and browser the bug was encountered in.** Try to reproduce it on multiple devices and browsers. It will help me to know if it’s a general bug in the app or specific to a certain environment.
- **A descriptive summary of the bug, possibly including screenshots.** I want to know exactly what the bug looked like, so I can recognize it when I’m trying to reproduce the issue and produce a fix.
- **The exact steps you took to produce the bug.** Is it reproducible? If it occurred once, then it should certainly be able to occur again. Figure out how you produced the bug in the first place, how to reproduce it (as consistently as possible), and let me know the steps here. A bug report like “When chapter 2 rendered, there was only one page” is not particularly helpful. A bug report like “When you resize the screen three times in a row, then jump to segment 4 of chapter 2, the Reader shows that chapter 2 only has one page” is very helpful.
- **The reason you think the bug may have occurred.** This falls more into debugger territory, so don’t feel obligated to figure this out and include it. However, if you can manage it, this information would be very helpful to me.

## Tester Checklist

This checklist represents the bare minimum functionality that each tester should cover; the expected behavior of each item on this list is described in detail under [Expected Reader Functionality](#expected-reader-functionality). A good test will consist of mixing and matching various permutations of items on the below list. Try to come up with your own creative test cases!

- [ ] Book Events    
    - [ ] Open 
        - [ ] Cover Click
        - [ ] Right arrow key
        - [ ] URL Load
    - [ ] Inline Links
        - [ ] Share
        - [ ] Comment
        - [ ] Author's Note
    - [ ] Render
    - [ ] Reflow
- [ ] Book Navigation Events
    - [ ] Table Of Contents
        - [ ] Within Chapter
        - [ ] Between Chapters
    - [ ] Page Turn (forward/backward)
        - [ ] Within Chapter
        - [ ] Between Chapters  
    - [ ] URL Load
    - [ ] Bookmark
    - [ ] Inline Link
        - [ ] Comment
        - [ ] Author's Note
    - [ ] Renderer checkpoint updates
- [ ] On Selected Entry Change
    - [ ] Disqus update
    - [ ] Title update
    - [ ] Bookmark update
    - [ ] ToC heading update
    - [ ] Hash update
    - [ ] Renderer checkpoint update
- [ ] Bookmarks
    - [ ] Set on Selected Entry Change
    - [ ] Set on arrival at Entry
- [ ] Cover Open/Closed State
    - [ ] Open
    - [ ] Closed
- [ ] Table of Contents
    - [ ] Heading matches selected entry
    - [ ] Expands / Contracts
    - [ ] Unread bolded
    - [ ] Selected entry highlighted
    - [ ] "new!" next to most recent unread entries
- [ ] Misc.
    - [ ] Contact Link
    - [ ] Credits Link
    - [ ] Social Buttons
    - [ ] Mailchimp Sign-Up Form
    - [ ] High-res images load
    - [ ] Forward arrow disabled on last page

## Expected Reader Functionality



## Terminology Reference

#### Chapter 
The same thing as an Episode (or Interlude). In the code, it's just referred to as a chapter. The Reader application renders one chapter at a time. (i.e. _Episode 1. Welcome to the Party / Heat Wave_)

#### Sub-chapter

The heading level below a chapter. Chapters are broken into sub-chapters. (i.e. _1a. Welcome to the Party_)

#### Segment

The heading level below a sub-chapter, usually just a number denoting a new section or scene break. Content is usually released by segments.

#### Entry

An entry refers to a block of data from the database. It consists of a title, text content (optional), author's note (optional), release date, etc. Every heading in the Reader, whether it is a chapter, sub-chapter, or segment, is also an entry.

#### Empty entry / No-content entry

Often chapter headings with sub-headings will not have content of their own, though any entry may not have content. These no-content entries are treated differently in the Reader than entries with text content.

#### Selected Entry

The selected entry refers to the entry that the Reader application considers active or currently being read. This changes with various navigation actions, and many things throughout the application are based on the selected entry (i.e. which Disqus thread is displayed, the ID in the URL hash, the table of contents selection, the current bookmark, etc.).

#### ToC

Table of Contents. Refers to the dropdown displayed at the top of the book.

#### Bookmark

The bookmark refers to an entry in persistant storage which the Reader application automatically keeps so it can bring the reader back to where they left off last time they visited the site.

#### Checkpoint

When a reflow occurs, the renderer does its best to remember where the reader was in the book and to put the reader back there. It does this using a checkpoint, which refers to a paragraph or heading on the current page which the renderer takes note of in case it needs to jump back there.
