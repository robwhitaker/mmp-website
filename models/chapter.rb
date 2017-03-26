class Chapter < ActiveRecord::Base
  has_many :entries, dependent: :destroy
  accepts_nested_attributes_for :entries
  after_initialize :init

  def init
    self.isInteractive   ||= false
  end

  def has_content?
    !self.content.blank?
  end
end
