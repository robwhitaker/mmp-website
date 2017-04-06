class CreateChapters < ActiveRecord::Migration[4.2]
  def change
    create_table :chapters do |t|
      t.integer  :order
      t.text     :stylesheet
      t.string   :title
      t.text     :content
      t.datetime :release_date
      t.text     :authors_note

      t.timestamps null: false
    end
  end
end
