class Entry < ActiveRecord::Base
  belongs_to :chapter
  default_scope { order(order: :asc) }

  def has_content?
    !self.content.blank?
  end
end
