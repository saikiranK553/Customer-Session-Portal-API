package com.maveric.customerSessionPortal.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        servers = {
                @Server(
                        description = "LOCAL swagger  ui",
                        url = "http://localhost:8080/api/sessions"
                ),
        }

)

public class SwaggerConfig {

}
