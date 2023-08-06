module HasUniqueKey
  extend ActiveSupport::Concern

  included do
    validates :unique_key, presence: true

    before_validation :set_unique_key, on: :create
  end

  private

  # @return [void]
  def set_unique_key
    self.unique_key ||= ULID.generate
  end
end
