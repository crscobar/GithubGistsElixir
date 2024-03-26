defmodule ElixirGistWeb.CreateGistLive do
  require Logger

  use PhoenixHTMLHelpers
  use ElixirGistWeb, :live_view
  alias ElixirGist.{Gists, Gists.Gist}

  def mount(_params, _session, socket) do
    socket = assign(
      socket,
      form: to_form(Gists.change_gist(%Gist{}))
    )

    {:ok, socket}
  end

  def handle_event("validate", %{"gist" => params}, socket) do
    changeset = %Gist{}
      |> Gists.change_gist(params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, :form, to_form(changeset))}
  end

  def handle_event("create", %{"gist" => params}, socket) do
    case Gists.create_gist(socket.assigns.current_user, params) do
      {:ok, gist} ->
        socket = push_event(socket, "clear-textareas", %{})
        empty_changeset = Gists.change_gist(%Gist{})
        socket = assign(socket, :form, to_form(empty_changeset))
        {:noreply, push_navigate(socket, to: ~p"/gist?#{[id: gist.id]}")}
      {:error, %Ecto.Changeset{} = error_changeset} ->
        {:noreply, assign(socket, :form, to_form(error_changeset))}
    end
  end
end
