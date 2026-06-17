package codesquad.airdnd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class AirdndApplication {

	public static void main(String[] args) {
		SpringApplication.run(AirdndApplication.class, args);
	}

}
