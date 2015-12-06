defmodule Mmp.Chapter do
  use Mmp.Web, :model

  schema "chapters" do
    field :order, :integer
    field :stylesheet, :string
    field :title, :string
    field :content, :string
    field :release_date, Ecto.DateTime

    timestamps
  end

  @required_fields ~w(order stylesheet title content release_date)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
