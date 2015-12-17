defmodule Mmp.EntryControllerTest do
  use Mmp.ConnCase

  alias Mmp.Entry
  @valid_attrs %{authors_note: "some content", chapter: 42, content: "some content", level: 42, order: 42, release_date: "2010-04-17 14:00:00", title: "some content"}
  @invalid_attrs %{}

  setup do
    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, entry_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    entry = Repo.insert! %Entry{}
    conn = get conn, entry_path(conn, :show, entry)
    assert json_response(conn, 200)["data"] == %{"id" => entry.id,
      "chapter" => entry.chapter,
      "level" => entry.level,
      "order" => entry.order,
      "title" => entry.title,
      "content" => entry.content,
      "release_date" => entry.release_date,
      "authors_note" => entry.authors_note}
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_raise Ecto.NoResultsError, fn ->
      get conn, entry_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, entry_path(conn, :create), entry: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Entry, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, entry_path(conn, :create), entry: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    entry = Repo.insert! %Entry{}
    conn = put conn, entry_path(conn, :update, entry), entry: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Entry, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    entry = Repo.insert! %Entry{}
    conn = put conn, entry_path(conn, :update, entry), entry: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    entry = Repo.insert! %Entry{}
    conn = delete conn, entry_path(conn, :delete, entry)
    assert response(conn, 204)
    refute Repo.get(Entry, entry.id)
  end
end
