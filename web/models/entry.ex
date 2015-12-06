defmodule Mmp.Entry do
  use Mmp.Web, :model

  schema "entries" do
    field :chapter, :integer
    field :level, :integer
    field :order, :integer
    field :title, :string
    field :content, :string
    field :release_date, Ecto.DateTime

    timestamps
  end

  @required_fields ~w(chapter level order title content release_date)
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
