class Chapter < ActiveRecord::Base
  has_many :entries, foreign_key: 'chapterId', dependent: :destroy
  default_scope { order(order: :asc) }
  accepts_nested_attributes_for :entries
  after_initialize :init

  def init
    self.stylesheet      ||= ''
    self.title           ||= ''
    self.content         ||= ''
    self.authorsNote     ||= ''
    self.docId           ||= ''
    self.interactiveData ||= ''
    self.interactiveUrl  ||= ''
    self.isInteractive   ||= false
  end

  def has_content?
    !self.content.blank?
  end
end
