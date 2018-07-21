// @flow
import * as React from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import AuthStore from 'stores/AuthStore';
import UiStore from 'stores/UiStore';
import Checkbox from 'components/Checkbox';
import Button from 'components/Button';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';
import HelpText from 'components/HelpText';

type Props = {
  auth: AuthStore,
  ui: UiStore,
};

@observer
class Security extends React.Component<Props> {
  form: ?HTMLFormElement;

  @observable require2FA: boolean;
  @observable requireNotGuest: boolean;

  componentDidMount() {
    const { auth } = this.props;
    if (auth.team) {
      this.require2FA = auth.team.require2FA;
      this.requireNotGuest = auth.team.requireNotGuest;
    }
  }

  handleSubmit = async (ev: SyntheticEvent<*>) => {
    ev.preventDefault();

    await this.props.auth.updateTeam({
      require2FA: this.require2FA,
      requireNotGuest: this.requireNotGuest,
    });
    this.props.ui.showToast('Settings saved', 'success');
  };

  handleChange = (ev: SyntheticInputEvent<*>) => {
    if (ev.target.name === 'require2FA') {
      this.require2FA = ev.target.checked;
    }
    if (ev.target.name === 'requireNotGuest') {
      this.requireNotGuest = ev.target.checked;
    }
  };

  get isValid() {
    return this.form && this.form.checkValidity();
  }

  render() {
    const { team, isSaving } = this.props.auth;
    if (!team) return null;

    return (
      <CenteredContent>
        <PageTitle title="Security" />
        <h1>Security</h1>
        {team.slackConnected && (
          <HelpText>
            This Outline is connected to a <strong>Slack</strong> team. Your
            team mates can join by signing in with their Slack account details.
          </HelpText>
        )}
        {team.googleConnected && (
          <HelpText>
            This Outline connected to a <strong>Google</strong> domain. Your
            team mates can join by signing in with their Google account. There
            are no security settings for Google authenticated teams at this
            time.
          </HelpText>
        )}

        <form onSubmit={this.handleSubmit} ref={ref => (this.form = ref)}>
          {team.slackConnected && (
            <React.Fragment>
              <Checkbox
                label="Block signin without 2FA"
                name="require2FA"
                checked={this.require2FA}
                onChange={this.handleChange}
                note="Enabling this option will prevent users without 2FA enabled from accessing this Outline team."
              />
              <Checkbox
                label="Block guest account signin"
                name="requireNotGuest"
                checked={this.requireNotGuest}
                onChange={this.handleChange}
                note="Enabling this option will prevent single and multi-channel Slack guests from accessing this Outline team."
              />
              <Button type="submit" disabled={isSaving || !this.isValid}>
                {isSaving ? 'Saving…' : 'Save'}
              </Button>
            </React.Fragment>
          )}
        </form>
      </CenteredContent>
    );
  }
}

export default inject('auth', 'ui')(Security);
