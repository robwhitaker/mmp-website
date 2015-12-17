defmodule Mmp.ChapterView do
  use Mmp.Web, :view

  alias Ecto.DateTime

  def render("index.json", %{chapters: chapters}) do
    %{data: render_many(chapters, Mmp.ChapterView, "chapter.json")}
  end

  def render("show.json", %{chapter: chapter}) do
    %{data: render_one(chapter, Mmp.ChapterView, "chapter.json")}
  end

  def render("chapter.json", %{chapter: chapter}) do
    %{id: chapter.id,
      order: chapter.order,
      stylesheet: chapter.stylesheet,
      title: chapter.title,
      content: chapter.content,
      release_date: DateTime.to_string(chapter.release_date),
      authors_note: chapter.authors_note,
      entries: chapter.entries}
  end
end
