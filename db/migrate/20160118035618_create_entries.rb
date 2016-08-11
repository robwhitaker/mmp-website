class CreateEntries < ActiveRecord::Migration[4.2]
  def change
    create_table :entries do |t|
      t.belongs_to :chapter
      t.integer :level
      t.integer :order
      t.string :title
      t.text :content
      t.datetime :release_date
      t.text :authors_note

      t.timestamps null: false
    end
  end
end
