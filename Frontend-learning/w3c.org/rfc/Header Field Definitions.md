# [Header Field Definitions](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.23)



      Accept         = "Accept" ":"
                        #( media-range [ accept-params ] )
      media-range    = ( "*/*"
                        | ( type "/" "*" )
                        | ( type "/" subtype )
                        ) *( ";" parameter )
      accept-params  = ";" "q" "=" qvalue *( accept-extension )
      accept-extension = ";" token [ "=" ( token | quoted-string ) ]