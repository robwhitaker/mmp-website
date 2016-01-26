# bundle exec irb -I. -r app.rb

## Chapter retrieval restricted | GET /api/chapters
# curl -X GET http://localhost:4567/api/chapters

## Chapter creation | POST /api/chapters ##
# curl -H "Content-Type: application/json" -X POST -d '{"data": {"order": 1, "stylesheet": "<dingle mcringleberry>", "title": "Hey!", "content": "Beep boop", "release_date": "2016-10-01 12:30:00", "authors_note": "wao"}, "secretKey": ""}' http://localhost:4567/api/chapters

## Chapter with entries creation | POST /api/chapters ##
# curl -H "Content-Type: application/json" -X POST -d '{"data": {"order": 1, "stylesheet": "<dingle mcringleberry>", "title": "Hey!", "content": "Beep boop", "release_date": "2016-10-01 12:30:00", "authors_note": "wao", "entries": [{"order": 1, "title": "Entry #1", "content": "Hinkle dinkle doo", "release_date": "2016-10-01 12:30:00", "authors_note": "Womp"}, {"order": 2, "title": "Entry #2", "content": "Hinkle dinkle doo", "release_date": "2016-10-01 12:30:00", "authors_note": "Wimp"}]}, "secretKey": ""}' http://localhost:4567/api/chapters

## Chapter with entries unrestricted retrieval | POST /api/chapters ##
# curl -H "Content-Type: application/json" -X POST -d '{"data": {}, "secretKey": "beep"}' http://localhost:4567/api/chapters

## Batch update | POST /api/batch ##
# curl -H "Content-Type: application/json" -X POST -d '{"chapters": {"delete": [{"id": 2},{"id": 3}], "update": [{"id": 1, "order": 1, "stylesheet": "<dingle mcringleberry>", "title": "I got updated!", "content": "Beep boop", "release_date": "2016-10-01 12:30:00", "authors_note": "wao"}]}, "entries": {"delete": [{"id": 2}], "update": [{"id": 1, "order": 1, "title": "I got updated!", "content": "Hinkle dinkle doo", "release_date": "2016-10-01 12:30:00", "authors_note": "Womp"}], "create": [{"chapter_id": 1, "order": 1, "title": "Entry #1", "content": "Hinkle dinkle doo", "release_date": "2016-10-01 12:30:00", "authors_note": "Womp"},{"chapter_id": 1, "order": 2, "title": "Entry #2", "content": "Hinkle dinkle doo", "release_date": "2016-10-01 12:30:00", "authors_note": "Wimp"}]}}' http://localhost:4567/api/batch

@chapter1 = Chapter.create(order: 1, stylesheet: "<dingle mcringleberry>", title: "Hey!", content: "Beep boop", release_date: "2015-10-01 12:30:00", authors_note: "wao")
@chapter1.entries.create(order: 1, title: "Entry #1", content: "Hinkle dinkle domp", release_date: "2015-10-02 12:30:00", authors_note: "Womp")
@chapter2 = Chapter.create(order: 2, stylesheet: "<dingle mcringleberry>", title: "Hey!", content: "Beep boop", release_date: "2016-10-01 12:30:00", authors_note: "wao")
@chapter2.entries.create(order: 1, title: "Entry #1", content: "Hinkle dinkle domp", release_date: "2016-10-02 12:30:00", authors_note: "Womp")
@chapter2.entries.create(order: 2, title: "Entry #2", content: "Hinkle dinkle womp", release_date: "2016-10-02 12:30:00", authors_note: "Wimp")
@chapter3 = Chapter.create(order: 3, stylesheet: "<dingle mcrinkleberry>", title: "Hej!", content: "Beep bomp", release_date: "2016-10-11 12:30:00", authors_note: "woo")
@chapter3.entries.create(order: 1, title: "Entry #1", content: "Hinkle dinkle domp", release_date: "2016-10-02 12:30:00", authors_note: "Womp")
@chapter3.entries.create(order: 2, title: "Entry #2", content: "Hinkle dinkle womp", release_date: "2016-10-02 12:30:00", authors_note: "Wimp")
@chapter4 = Chapter.create(order: 4, stylesheet: "<dingle mcrangleberry>", title: "Hai!", content: "Beep bomp", release_date: "2016-10-11 12:30:00", authors_note: "woo")
