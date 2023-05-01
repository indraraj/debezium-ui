/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
public class NativeCreateAndDeleteMongoDbConnectorIT extends CreateAndDeleteMongoDbConnectorIT {

    // Execute the same tests but in native mode.
}
