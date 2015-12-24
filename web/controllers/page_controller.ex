defmodule Mmp.PageController do
  use Mmp.Web, :controller

  def index(conn, _params) do
    render conn, "editor.html"
  end
end
