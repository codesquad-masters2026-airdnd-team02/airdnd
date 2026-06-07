ALTER TABLE listing
    DROP COLUMN city,
    DROP COLUMN district,
    DROP COLUMN street_address,
    DROP COLUMN zip_code,
    ADD COLUMN road_address  VARCHAR(255)   NOT NULL DEFAULT '' AFTER detail_address,
    ADD COLUMN postal_code   VARCHAR(5)     NOT NULL DEFAULT '' AFTER road_address,
    ADD COLUMN latitude      DECIMAL(10, 7) NOT NULL DEFAULT 0  AFTER postal_code,
    ADD COLUMN longitude     DECIMAL(10, 7) NOT NULL DEFAULT 0  AFTER latitude,
    ADD COLUMN sido_code     VARCHAR(10)    NOT NULL DEFAULT '' AFTER longitude,
    ADD COLUMN sigungu_code  VARCHAR(10)    NOT NULL DEFAULT '' AFTER sido_code;

CREATE INDEX idx_listing_region ON listing (sido_code, sigungu_code);
