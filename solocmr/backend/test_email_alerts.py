import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta

# Import the function to test
from email_alerts import process_email_alerts

class TestEmailScheduler(unittest.TestCase):
    @patch('email_alerts.send_email')
    @patch('email_alerts.Client')
    @patch('email_alerts.User')
    def test_process_email_alerts(self, mock_user, mock_client, mock_send_email):
        # Setup mock user
        mock_user_instance = MagicMock()
        mock_user_instance.email = 'test@example.com'
        mock_user_instance.preferences = MagicMock()
        mock_user_instance.preferences.days_before_due = 2
        mock_user_instance.preferences.snoozed = []
        mock_user_instance.preferences.completed = []

        # Setup mock client
        due_date = (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d')
        mock_client_instance = MagicMock()
        mock_client_instance.name = 'Test Client'
        mock_client_instance.due_date = due_date
        mock_client_instance.id = 1

        # Configure return values
        mock_user.query.all.return_value = [mock_user_instance]
        mock_client.query.filter_by.return_value.all.return_value = [mock_client_instance]

        # Call the function
        process_email_alerts()

        # Assert send_email was called once
        mock_send_email.assert_called_once_with(
            'test@example.com',
            'Upcoming Due Date for Test Client',
            "Client 'Test Client' is due in 2 day(s)."
        )

if __name__ == '__main__':
    unittest.main()
