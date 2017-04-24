class AddInteractiveSegmentFields < ActiveRecord::Migration[5.0]
  def change
    add_column :chapters, :interactive, :boolean
    add_column :chapters, :gamedata, :string
    add_column :chapters, :jssource, :string

    add_column :entries, :interactive, :boolean
    add_column :entries, :gamedata, :string
    add_column :entries, :jssource, :string
  end
end
