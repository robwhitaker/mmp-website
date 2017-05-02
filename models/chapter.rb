class Chapter < ActiveRecord::Base
  has_many :entries, dependent: :destroy
  default_scope { order(order: :asc) }

  accepts_nested_attributes_for :entries

  def has_content?
    !self.content.blank?
  end
end
