module.exports = {
    vhosts: {
        '/health_decl': {
            connection: {
                url: process.env.RABBITMQ_URL,
            },
            exchanges: [
                'jobs_pending_ex',
                'jobs_completed_ex',
                'jobs_failed_ex',
            ],
            queues: [
                'jobs_pending_q',
                'jobs_completed_q',
                'jobs_failed_q',
            ],
            bindings: [
                'jobs_pending_ex -> jobs_pending_q',
                'jobs_completed_ex -> jobs_completed_q',
                'jobs_failed_ex -> jobs_failed_q',
            ],
            publications: {
                jobs_pending_pub: {
                    exchange: 'jobs_pending_ex',
                },
                jobs_completed_pub: {
                    exchange: 'jobs_completed_ex',
                },
                jobs_failed_pub: {
                    exchange: 'jobs_failed_ex',
                },
            },
            subscriptions: {
                jobs_pending_sub: {
                    queue: 'jobs_pending_q',
                },
                jobs_completed_sub: {
                    queue: 'jobs_completed_q',
                },
                jobs_failed_sub: {
                    queue: 'jobs_failed_q',
                },
            }
        },
    },
};
