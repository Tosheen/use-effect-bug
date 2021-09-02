import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

export const CardStatus = () => {
  const messagingState = useMessagingUpgrade();

  React.useEffect(() => {
    console.log("Effect function triggered with:", messagingState.status);
  }, [messagingState.status]);

  return (
    <div>
      {messagingState.status === "loading" && <span>Loading</span>}

      {messagingState.status === "not-active" && (
        <>
          <h2>You have not activated trial period!</h2>
          <div>
            <button
              disabled={messagingState.transitioning}
              onClick={() => messagingState.actions.activateTrial()}
            >
              Activate Trial
            </button>
          </div>
        </>
      )}

      {messagingState.status === "active-trial" && (
        <div>
          <h2>Your Card is now in trial period, well done!</h2>
        </div>
      )}
    </div>
  );
};

function useMessagingUpgrade() {
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery("message-upgrade", () => {
    return Promise.resolve({
      status: "not-active",
    });
  });

  const [counter, setCounter] = React.useState(null);

  const activateTrialMutation = useMutation(
    () => {
      return Promise.resolve({
        status: "active-trial",
      });
    },
    {
      onSuccess: (result) => {
        queryClient.setQueryData("message-upgrade", {
          status: "active-trial",
        });
        setCounter(null);
      },
    }
  );

  const activateTrial = () => {
    activateTrialMutation.mutate();
  };

  if (isLoading) {
    return {
      status: "loading",
    };
  } else {
    if (data) {
      if (data.status === "not-active") {
        return {
          status: "not-active",
          actions: {
            activateTrial,
          },
          transitioning: activateTrialMutation.isLoading,
        };
      } else if (data.status === "active-trial") {
        return {
          status: "active-trial",
        };
      }
    }
  }
}
