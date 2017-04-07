import React from 'react';
import update from 'immutability-helper';

export default function asyncComponent(getComponent)
{
    return class AsyncComponent extends React.Component
    {
        static Component = null;

        constructor(props, context)
        {
            super(props, context);
            this.mounted = false;
            this.state = {
                Component: AsyncComponent.Component
            };
        }

        componentWillMount()
        {
            if (!this.state.Component)
            {
                getComponent().then((Component) =>
                {
                    AsyncComponent.Component = Component;
                    if (this.mounted)
                    {
                        this.setState(update(this.state, {
                            Component: { $set: Component }
                        }));
                    }
                });
            }
        }

        componentDidMount()
        {
            this.mounted = true;
        }

        componentWillUnmount()
        {
            this.mounted = false;
        }

        render()
        {
            const { Component } = this.state;
            if (Component)
            {
                return <Component {...this.props} />;
            }
            else
            {
                return null;
            }
        }
    };
}
