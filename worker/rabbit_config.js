module.exports = {
    vhosts: {
        '/health_decl': {
            connection: {
                url: process.env.RABBITMQ_URL,
            },
            exchanges: [
                'jobs_pending_ex',
                'jobs_completed_ex',
                'retry',
                'delay_ex',
                'dead_letters',
            ],
            queues: [
                {
                    name: 'jobs_pending_q',
                    options: {
                        arguments: {
                          // Route nacked messages to the dead letter queue
                          'x-dead-letter-exchange': 'dead_letters',
                        }
                      }
                },
                'jobs_completed_q',
                {
                    name: 'delay_q',
                    options: {
                        arguments: {
                            'x-message-ttl': 3000,
                            'x-dead-letter-exchange': 'retry',
                        },
                    },
                },
                'dead_letters_q',
            ],
            bindings: [
                'jobs_pending_ex -> jobs_pending_q',
                'jobs_completed_ex -> jobs_completed_q',
                'delay_ex -> delay_q',
                'retry -> jobs_pending_q',
                'dead_letters -> dead_letters_q',
            ],
            publications: {
                jobs_pending_pub: {
                    exchange: 'jobs_pending_ex',
                },
                jobs_completed_pub: {
                    exchange: 'jobs_completed_ex',
                },
                retry_later: {
                    exchange: 'delay_ex',
                },
            },
            subscriptions: {
                jobs_pending_sub: {
                    queue: 'jobs_pending_q',
                    prefetch: 1,
                },
                jobs_completed_sub: {
                    queue: 'jobs_completed_q',
                },
                dead_letters_sub: {
                    queue: 'dead_letters_q',
                },
            },
        },
    },
    recovery: {
        deferred_retry: [{
            strategy: 'forward',
            attempts: 3,
            publication: 'retry_later',
            xDeathFix: true, // See https://github.com/rabbitmq/rabbitmq-server/issues/161
        }, {
            strategy: 'nack',
        }],

        // Republishing with immediate nack returns the message to the original queue but decorates
        // it with error headers. The next time Rascal encounters the message it immediately nacks it
        // causing it to be routed to the services dead letter queue
        dead_letter: [{
            strategy: 'republish',
            immediateNack: true,
        }],
    },
};
