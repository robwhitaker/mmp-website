# Test cURL commands
# curl -H "Content-Type: application/json" http://localhost:4000/api/chapters
# curl -H "Content-Type: application/json" -X POST -d '{"chapter": {"order": 1, "stylesheet": "<dingle mcringleberry>", "title": "Hey!", "content": "Beep boop", "release_date": "2016-10-01 12:30:00", "authors_note": "wao"}}' http://localhost:4000/api/chapters

Mmp.Repo.insert!(%Mmp.Chapter{
  order: 1,
  stylesheet: "<dingle mcringleberry>",
  title: "Test Chapter",
  content: "Hello there Ding. Lorum ipsum dude.",
  release_date: %Ecto.DateTime{year: 2016, month: 12, day: 20, hour: 15, min: 45, sec: 12},
  authors_note: "Bloopy bloop chapter author note"
})
Mmp.Repo.insert!(%Mmp.Entry{
  chapter_id: 1,
  level: 0,
  order: 1,
  title: "Test Subchapter",
  content: "Lorum Lorum Ipsum Ipsum",
  release_date: %Ecto.DateTime{year: 2016, month: 12, day: 20, hour: 15, min: 45, sec: 12},
  authors_note: "Bloopy bloop entry author note"
})
Mmp.Repo.insert!(%Mmp.Entry{
  chapter_id: 1,
  level: 1,
  order: 2,
  title: "Test Entry",
  content: "Lorum Lorum Lorum Ipsum Ipsum Ipsum",
  release_date: %Ecto.DateTime{year: 2016, month: 12, day: 20, hour: 15, min: 45, sec: 12},
  authors_note: "Bloopy bloop entry author note"
})
Mmp.Repo.insert!(%Mmp.Entry{
  chapter_id: 1,
  level: 1,
  order: 3,
  title: "Test Entry #2",
  content: "Lorum Lorum Lorum Lorum Ipsum Ipsum Ipsum Ipsum",
  release_date: %Ecto.DateTime{year: 2016, month: 12, day: 20, hour: 15, min: 45, sec: 12},
  authors_note: "Bloopy bloop entry author note"
})
Mmp.Repo.insert!(%Mmp.Chapter{
  order: 2,
  stylesheet: "<dingle mcringleberry the third>",
  title: "Test Chapter 2",
  content: "Hello there Ding. Lorum ipsum dude.",
  release_date: %Ecto.DateTime{year: 2017, month: 12, day: 20, hour: 15, min: 45, sec: 12},
  authors_note: "Bloopy bloop chapter author noteeee"
})
