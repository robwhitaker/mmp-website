defmodule Mmp.Repo.Migrations.CreateEntry do
  use Ecto.Migration

  def change do
    create table(:entries) do
      add :chapter, :integer
      add :level, :integer
      add :order, :integer
      add :title, :text
      add :content, :text
      add :release_date, :datetime

      timestamps
    end

  end
end
