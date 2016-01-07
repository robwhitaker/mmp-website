defmodule Mmp.ChapterController do
  use Mmp.Web, :controller

  alias Mmp.Chapter

  plug :scrub_params, "chapter" when action in [:create, :update]

  def index(conn, _params) do
    chapters = Chapter |> Mmp.Repo.all() |> Mmp.Repo.preload(:entries)
    render(conn, "index.json", chapters: chapters)
  end

  def create(conn, %{"chapter" => chapter_params}) do
    changeset = Chapter.changeset(%Chapter{}, chapter_params)

    case Repo.insert(changeset) do
      {:ok, chapter} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", chapter_path(conn, :show, chapter))
        |> render("show.json", chapter: (chapter |> Mmp.Repo.preload(:entries)))
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mmp.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    chapter = Mmp.Repo.get(Chapter, id) |> Mmp.Repo.preload(:entries)
    entries = chapter.entries

    conn
    |> assign(:chapter, chapter)
    |> assign(:entries, entries)
    |> render("show.json")
  end

  def update(conn, %{"id" => id, "chapter" => chapter_params}) do
    chapter = Repo.get!(Chapter, id)
    changeset = Chapter.changeset(chapter, chapter_params)

    case Repo.update(changeset) do
      {:ok, chapter} ->
        render(conn, "show.json", chapter: chapter)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mmp.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    chapter = Repo.get!(Chapter, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(chapter)

    send_resp(conn, :no_content, "")
  end
end
