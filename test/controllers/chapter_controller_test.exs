defmodule Mmp.ChapterControllerTest do
  use Mmp.ConnCase

  alias Mmp.Chapter
  @valid_attrs %{authors_note: "some content", content: "some content", order: 42, release_date: "2010-04-17 14:00:00", stylesheet: "some content", title: "some content"}
  @invalid_attrs %{}

  setup do
    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, chapter_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    chapter = Repo.insert! %Chapter{}
    conn = get conn, chapter_path(conn, :show, chapter)
    assert json_response(conn, 200)["data"] == %{"id" => chapter.id,
      "order" => chapter.order,
      "stylesheet" => chapter.stylesheet,
      "title" => chapter.title,
      "content" => chapter.content,
      "release_date" => chapter.release_date,
      "authors_note" => chapter.authors_note}
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_raise Ecto.NoResultsError, fn ->
      get conn, chapter_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, chapter_path(conn, :create), chapter: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Chapter, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, chapter_path(conn, :create), chapter: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    chapter = Repo.insert! %Chapter{}
    conn = put conn, chapter_path(conn, :update, chapter), chapter: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Chapter, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    chapter = Repo.insert! %Chapter{}
    conn = put conn, chapter_path(conn, :update, chapter), chapter: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    chapter = Repo.insert! %Chapter{}
    conn = delete conn, chapter_path(conn, :delete, chapter)
    assert response(conn, 204)
    refute Repo.get(Chapter, chapter.id)
  end
end
