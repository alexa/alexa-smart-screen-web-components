# Alexa Smart Screen Sample Attention System

The Alexa Smart Screen Sample Attention System provides a sample, text-based, implementation of an [Alexa Attention System][avs-attention-system-docs] for communicating Alexa State.  It implements the common [AttentionSystemRenderer][attention-system-interface] interface.

When integrated, it will render Alexa State to the lower right corner of your display:

example: `LISTENING`

This component is integrated by default in the [SampleApplication](../../samples/alexa-smart-screen-sample-app/README.md).

**Note:** This is **not** intended for production use, it is just a reference.

[avs-attention-system-docs]: https://developer.amazon.com/docs/alexa/alexa-voice-service/ux-design-attention.html
[attention-system-interface]: ../../packages/alexa-smart-screen-common/src/alexaState/IAttentionSystemRenderer.ts