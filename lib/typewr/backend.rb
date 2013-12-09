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
          @color = color_picker.next
        end

        ws.on :message do |event|
          # p [:message, event.data]
          data = JSON.parse(event.data)
          data.update(color: @color)
          @clients.each { |client| client.send data.to_json }
        end

        ws.on :close do |event|
          p [:close, ws.object_id, event.code]
          @clients.delete(ws).tap { ws = nil }
        end
        ws.rack_response
      else
        @app.call(env)
      end
    end

    def color_picker
      @@colors ||= %w(#FFCC00 #C71585 #4169E1 #32CD32 #FF1493 #006400 #D2691E #191970 #800080).cycle
    end
  end
end
