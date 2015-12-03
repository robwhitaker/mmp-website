defmodule Mmp.PageController do
  use Mmp.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
