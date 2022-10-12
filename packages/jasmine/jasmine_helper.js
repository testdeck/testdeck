const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
    spec: {
        displayErrorMessages: true,
        displayFailed: true,
        displayPending: true,
        displaySuccessful: true,
        displayStacktrace: 'pretty'
    }
}));
