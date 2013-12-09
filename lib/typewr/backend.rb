require 'faye/websocket'
require 'json'

module Typewr
  class Backend
    KEEPALIVE_TIME = 15
    def initialize(app)
      @app = app
      @clients = []
    end

    def call(env)
      if Faye::WebSocket.websocket?(env)
        ws = Faye::WebSocket.new(env, nil, ping: KEEPALIVE_TIME)
        
        ws.on :open do |event|
          p [:open, ws.object_id]
          @clients << ws
          @clients.each { |client| client.send client_count }
        end

        ws.on :message do |event|
          # p [:message, event.data]
          @clients.each { |client| client.send event.data }
        end

        ws.on :close do |event|
          p [:close, ws.object_id, event.code]
          @clients.delete(ws).tap { ws = nil }
          @clients.each { |client| client.send client_count }
        end
        ws.rack_response
      else
        @app.call(env)
      end
    end

    def client_count
      {count: @clients.size}.to_json
    end
  end
end
