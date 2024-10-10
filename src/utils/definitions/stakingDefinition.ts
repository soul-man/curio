const stakingDefinition = {
    types: {
        StakingRates: {
            collatorStakingRate: 'Perquintill',
            collatorRewardRate: 'Perquintill',
            delegatorStakingRate: 'Perquintill',
            delegatorRewardRate: 'Perquintill'
        }
    },
    runtime: {
        Staking: [
            {
                methods: {
                    get_staking_rates: {
                        description: 'Calculate the current staking and reward rates for collators and delegators',
                        params: [],
                        type: 'StakingRates'
                    },
                    get_unclaimed_staking_rewards: {
                        description: 'Calculate the claimable staking rewards for a given account address',
                        params: [
                            {
                                name: 'account',
                                type: 'AccountId32'
                            }
                        ],
                        type: 'Balance'
                    },
                    get_sorted_proposed_candidates: {
                        description: 'Provides a sorted list of collators most suited for given delegator\'s stake amount determined with some heuristic algorithm.',
                        params: [
                            {
                                name: 'balance',
                                type: 'Balance'
                            }
                        ],
                        type: 'Vec<AccountId>'
                    }
                },
                version: 1
            }
        ]
    }
  };

export default stakingDefinition;