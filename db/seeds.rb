# bundle exec irb -I. -r app.rb
# curl -X GET http://localhost:4567/api/chapters
# curl -H "Content-Type: application/json" -X POST -d '{"order": 1, "stylesheet": "<dingle mcringleberry>", "title": "Hey!", "content": "Beep boop", "release_date": "2016-10-01 12:30:00", "authors_note": "wao"}' http://localhost:9393/api/chapters
# curl -H "Content-Type: application/json" -X POST -d '{"order": 1, "stylesheet": "<dingle mcringleberry>", "title": "Hey!", "content": "Beep boop", "release_date": "2016-10-01 12:30:00", "authors_note": "wao", "entries": [{"order": 1, "title": "Entry #1", "content": "Hinkle dinkle doo", "release_date": "2016-10-01 12:30:00", "authors_note": "Womp"}, {"order": 2, "title": "Entry #2", "content": "Hinkle dinkle doo", "release_date": "2016-10-01 12:30:00", "authors_note": "Wimp"}]}' http://localhost:9393/api/chapters
# entries = '{"order": 1, "title": "Entry #1", "content": "Hinkle dinkle doo", "release_date": "2016-10-01 12:30:00", "authors_note": "Womp"}, {"chapter_id": 1, "order": 2, "title": "Entry #2", "content": "Hinkle dinkle doo", "release_date": "2016-10-01 12:30:00", "authors_note": "Wimp"}'

@chapter = Chapter.create(order: 1, stylesheet: "<dingle mcringleberry>", title: "Hey!", content: "Beep boop", release_date: "2016-10-01 12:30:00", authors_note: "wao")
@chapter.entries.create(order: 1, title: "Entry #1", content: "Hinkle dinkle domp", release_date: "2016-10-02 12:30:00", authors_note: "Womp")
@chapter.entries.create(order: 2, title: "Entry #2", content: "Hinkle dinkle womp", release_date: "2016-10-02 12:30:00", authors_note: "Wimp")
@chapter2 = Chapter.create(order: 2, stylesheet: "<dingle mcrinkleberry>", title: "Hej!", content: "Beep bomp", release_date: "2016-10-11 12:30:00", authors_note: "woo")
@chapter2.entries.create(order: 1, title: "Entry #1", content: "Hinkle dinkle domp", release_date: "2016-10-02 12:30:00", authors_note: "Womp")
@chapter2.entries.create(order: 2, title: "Entry #2", content: "Hinkle dinkle womp", release_date: "2016-10-02 12:30:00", authors_note: "Wimp")
