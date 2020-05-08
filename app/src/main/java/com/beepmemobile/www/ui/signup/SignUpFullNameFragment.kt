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

import com.beepmemobile.www.databinding.SignUpFullNameFragmentBinding
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.ui.main.MainViewModel

class SignUpFullNameFragment : Fragment() {
    private val model: SignUpFullNameViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private val navController by lazy { findNavController() }
    private var _binding: SignUpFullNameFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SignUpFullNameFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = SignUpFullNameFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        Toast.makeText(this.context, "1 - inside onViewCreated of SignUpFullNameFragment", Toast.LENGTH_LONG).show()

        binding.signUpFullNameBtnNext.setOnClickListener {

            var first_name = binding.signUpFullNameTxtFirstName.text.toString()
            var last_name = binding.signUpFullNameTxtLasttName.text.toString()

            var req = mapOf<String, String>("first_name" to first_name, "last_name" to last_name)

            authModel.singupStage(req, AuthState.AUTH_STAGE_FULL_NANE)
        }

        binding.signUpFullNameBtnBack.setOnClickListener {
            //TODO go back
        }
		
		val observer = Observer<AppUser> { app_user ->
		
			if(app_user.auth_state == AuthState.AUTH_STAGE_PROFILE_PHOTO){

                        Toast.makeText(
                            this.context,
                            "AuthState.AUTH_STAGE_PROFILE_PHOTO",
                            Toast.LENGTH_LONG
                        ).show()

                val direction =
                            SignUpFullNameFragmentDirections.moveToSignUpProfilePhotoFragment()
				navController.navigate(direction)
            }
		
		}
		
		// Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        authModel.auth.observe(viewLifecycleOwner, observer)


        Toast.makeText(this.context, "2 - inside onViewCreated of SignUpFullNameFragment", Toast.LENGTH_LONG).show()

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
