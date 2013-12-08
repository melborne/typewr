require 'sinatra/base'
require 'haml'

module Typewr
  class App < Sinatra::Base
    get "/" do
      haml :index
    end
  end
end
