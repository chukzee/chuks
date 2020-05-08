package com.beepmemobile.www.ui.signup

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.AuthState

import com.beepmemobile.www.databinding.SignUpWelcomeFragmentBinding
import com.beepmemobile.www.ui.main.MainViewModel

class SignUpWelcomeFragment : Fragment() {
    private val model: SignUpWelcomeViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private val navController by lazy { findNavController() }
    private var _binding: SignUpWelcomeFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SignUpWelcomeFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        Toast.makeText(this.context, "1 - inside onCreateView of SignUpWelcomeFragment", Toast.LENGTH_LONG).show()

        _binding = SignUpWelcomeFragmentBinding.inflate(inflater, container, false)
        val view = binding.root

        Toast.makeText(this.context, "2 - inside onCreateView of SignUpWelcomeFragment", Toast.LENGTH_LONG).show()


        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        Toast.makeText(this.context, "1 - inside onViewCreated of SignUpWelcomeFragment", Toast.LENGTH_LONG).show()

        binding.signUpWelcomeBtnNext.setOnClickListener {

            Toast.makeText(this.context, "binding.signUpWelcomeBtnNext.setOnClickListener", Toast.LENGTH_LONG).show()

            authModel.singupStage(mapOf(), AuthState.AUTH_STAGE_NONE)
        }
		
		val observer = Observer<AppUser> { app_user ->
		
			if(app_user.auth_state == AuthState.AUTH_STAGE_USERNAME){

                        Toast.makeText(
                            this.context,
                            "AuthState.AUTH_STAGE_USERNAME",
                            Toast.LENGTH_LONG
                        ).show()

                val direction = SignUpWelcomeFragmentDirections.moveToSignUpUsernameFragment()
				navController.navigate(direction)
            }
		
		}
		
		// Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        authModel.auth.observe(viewLifecycleOwner, observer)


        Toast.makeText(this.context, "2 - inside onViewCreated of SignUpWelcomeFragment", Toast.LENGTH_LONG).show()

        super.onViewCreated(view, savedInstanceState)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
