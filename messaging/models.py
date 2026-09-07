from django.conf import settings
from django.db import models

from bundles.models import BundleItem
from marketplace.models import Listing


class Conversation(models.Model):
    """
    Represents one buyer/seller message thread, contextualized by
    either a normal Listing or a BundleItem. MoveOn has a single
    unified inbox; buying/selling are filters over Conversation, not
    separate participant roles.
    """

    listing = models.ForeignKey(
        Listing, on_delete=models.SET_NULL, null=True, blank=True, related_name="conversations"
    )
    bundle_item = models.ForeignKey(
        BundleItem, on_delete=models.SET_NULL, null=True, blank=True, related_name="conversations"
    )
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversations_as_buyer"
    )
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversations_as_seller"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-last_message_at", "-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["buyer", "seller", "listing"], name="unique_conversation_per_listing"
            )
        ]

    def __str__(self):
        return f"{self.buyer} <-> {self.seller}"


class Message(models.Model):
    """
    Represents one chat message within a Conversation. Has no meaning
    outside its conversation, so it's deleted along with it.
    """

    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages"
    )
    body_text = models.TextField()
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sent_at"]
        constraints = [
            models.UniqueConstraint(
                fields=['conversation', 'sender', 'sent_at'], name='unique_message_debounce'
            )
        ]

    def __str__(self):
        return f"{self.sender}: {self.body_text[:30]}"
